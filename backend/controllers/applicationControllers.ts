import crypto from 'crypto';

import redisClient from '../database/redis.js';
import Applications from '../models/applicationsModel.js';
import User from '../models/userModels.js';
import Ambassadors from '../models/ambassadorModel.js';
import Referals from '../models/referalModel.js'

import { applicationQueue } from '../queues/applicationsQueue.js';
import { sendWelcomeEmail, sendRejectionEmail, sendApplicationSubmittionEmail } from '../utils/mailer.js';

import type { Request, Response } from 'express';

const submitApplication = async (req: Request, res: Response) => {
    const { playedBefore, name, course, college, convert, tournamentExp, state, city, phoneNo, email, hasTime, hasExperience, currentYear, status, accountRank, reasoning, experienceDetails, instagramUrl } = req.body;
    const lockKey = `lock:submit:${phoneNo}`;

    try {
        const isLocked = await redisClient.set(lockKey, 'locked', {
            EX: 10,
            NX: true
        });

        if (!isLocked) {
            return res.status(429).json({ success: false, message: 'TRANSMISSION IN PROGRESS. PLEASE WAIT.' });
        }

        if (state === '' || city === '') {
            return res.status(400).json({ success: false, message: 'EITHER STATE OR CITY IS EMPTY' });
        }

        const existing = await Applications.findOne({ $or: [{ email }, { phoneNo }] }).lean();
        
        if (existing) {
            await redisClient.del(lockKey);
            return res.status(409).json({ success: false, message: 'AN APPLICATION WITH THIS EMAIL OR PHONE ALREADY EXISTS.' });
        }

        await applicationQueue.add('new-application', {
            playedBefore, name, email, accountRank, status, hasExperience, course, state, city,
            college, convert, tournamentExp, phoneNo, hasTime, instagramUrl,
            currentYear, reasoning, experienceDetails
        });

        await redisClient.del('cache:applications');

        res.status(200).json({ success: true, message: 'APPLICATION FILED SUCCESSFULLY!' });
    } catch (err: any) {
        await redisClient.del(lockKey);

        console.error('[BACKEND ERROR] error in submitting application: ', err);

        if (err.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'UID OR EMAIL ALREADY REGISTERED IN THE FRONT LINE.' 
            });
        }

        const errMessage = 'Internal Server Error';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getApplications = async (req: Request, res: Response) => {
    const cacheKey = 'cache:applications';

    try {
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            return res.status(200).json({ success: true, applications: JSON.parse(cachedData), source: 'cache' });
        }

        const applications = await Applications.find();

        await redisClient.setEx(cacheKey, 300, JSON.stringify(applications));

        res.status(200).json({ success: true, applications });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting applications: ', err);

        const errMessage = 'Internal Server Error';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Rejected', 'Accepted'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'INVALID STATUS SIGNAL DETECTED' });
        }

        const application = await Applications.findById(id);

        if (!application) {
            return res.status(404).json({ success: false, message: 'DOSSIER NOT FOUND' });
        }

        if (application.status === 'Accepted') {
            return res.status(400).json({ success: false, message: 'OPERATIVE ALREADY ENLISTED' });
        }

        application.status = status;
        await application.save();

        const tempPassword = crypto.randomBytes(6).toString('hex');

        if (status === 'Accepted') {
            const newUser = await User.create({
                email: application.email,
                password: tempPassword,
                role: 'Ambassador',
                mustChangePassword: true
            });

            await Ambassadors.create({
                ambassadorId: newUser._id,
                collegeName: application.college
            });
        }

        await redisClient.del('cache:applications');

        if (status === 'Accepted') {
            sendWelcomeEmail(application.email, application.name, tempPassword).catch((err) => console.error('[MAILER] Send welcome email failed: ', err));;
        } else {
            sendRejectionEmail(application.email, application.name).catch((err) => console.error('[MAILER] Send rejectionemail failed: ', err));
        }

        res.status(200).json({ success: true, message: status === 'Accepted' ? 'OPERATIVE ENLISTED & INTEL SENT' : `APPLICATION ${status.toUpperCase()}`, application });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in updating applications: ', err);

        const errMessage = 'Internal Server Error';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getReferals = async (req: Request, res: Response) => {
    const cacheKey = 'cache:referals';

    try {
        const cachedData = await redisClient.get(cacheKey);

        if(cachedData) {
            return res.status(200).json({ success: true, referals: JSON.parse(cachedData), source: 'cache' });
        }

        const referals = await Referals.find();

        await redisClient.setEx(cacheKey, 300, JSON.stringify(referals));

        return res.status(200).json({ success: true, referals });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in fetching referals: ', err);

        const errMessage = 'Internal Server Error';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const updateReferalStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Rejected', 'Accepted'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'INVALID STATUS SIGNAL DETECTED' });
        }

        const referal = await Referals.findById(id);

        if(!referal) {
            return res.status(404).json({ success: false, message: 'DOSSIER NOT FOUND' });
        }

        if(referal.status === 'Accepted') {
            return res.status(400).json({ success: false, message: 'OPERATIVE ALREADY ENLISTED' });
        }

        referal.status = status;
        await referal.save();

        const tempPassword = crypto.randomBytes(6).toString('hex');

        if (status === 'Accepted') {
            const ambassador = await Ambassadors.findOne({ ambassadorId: referal.MVPID });

            if(!ambassador) {
                return res.status(400).json({ success: false, message: 'AMBASSADOR NOT FOUND TO INCREASE RP' });
            }

            const reward = 300;
            const MAX_RP_THRESHOLD = 6000;

            const rpSpaceRemaining = Math.max(0, MAX_RP_THRESHOLD - ambassador.RP);

            if(rpSpaceRemaining === 0) {
                ambassador.XP += reward;
            } else if(100 > rpSpaceRemaining) {
                ambassador.RP += rpSpaceRemaining;

                const remainingRp = reward - rpSpaceRemaining;
                ambassador.XP += remainingRp;
            } else {
                ambassador.RP += reward;
            }

            await ambassador.save();

            const newUser = await User.create({
                email: referal.email,
                password: tempPassword,
                role: 'Ambassador',
                mustChangePassword: true
            });

            await Ambassadors.create({
                ambassadorId: newUser._id,
                collegeName: referal.college
            });
        }

        await redisClient.del('cache:referals');

        if (status === 'Accepted') {
            sendWelcomeEmail(referal.email, referal.name, tempPassword).catch((err) => console.error('[MAILER] Send welcome email failed: ', err));;
        } else {
            sendRejectionEmail(referal.email, referal.name).catch((err) => console.error('[MAILER] Send rejectionemail failed: ', err));
        }

        res.status(200).json({ success: true, message: status === 'Accepted' ? 'OPERATIVE ENLISTED & INTEL SENT' : `APPLICATION ${status.toUpperCase()}`, referal });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in updating referal status: ', err);

        const errMessage = 'Internal Server Error';

        res.status(500).json({ success: false, message: errMessage });
    }
}

export { submitApplication, getApplications, updateApplicationStatus, getReferals, updateReferalStatus }
