import { Readable } from 'stream';

import User from '../models/userModels.js';
import Tasks from '../models/tasksModel.js';
import Cohort from '../models/cohortModel.js';
import Rewards from '../models/rewardsModel.js';
import Ambassadors from '../models/ambassadorModel.js';
import Submissions from '../models/submissionsModel.js';

import { drive } from '../utils/googleDrive.js';
import { appendToGoogleSheets } from '../utils/sheetsTracker.js';

import type { Request, Response } from 'express';
import { appendPlayerToGoogleSheets } from '../utils/sheetsTracker.js';
import Applications from '../models/applicationsModel.js';
import Referals from '../models/referalModel.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const getDashboardSync = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        
        const dossier = await Ambassadors.findOne({ ambassadorId: userId });
        if (!dossier) return res.status(404).json({ success: false, message: 'OPERATIVE NOT FOUND' });

        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({ success: false, message: 'OPERATIVE RECORD NOT FOUND' });
        }

        const activeTasks = await Tasks.find({ status: 'In Progress' }).limit(3);

        res.status(200).json({ success: true, dossier, activeTasks, serverTime: new Date(), mustChangePassword: user.mustChangePassword });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in dashboard sync: ', err);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const chooseAvator = async (req: Request, res: Response) => {
    try {
        const { avator } = req.body;
        const userId = (req as any).userId;

        if (!avator) {
            return res.status(400).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }

        const ambassador = await Ambassadors.findOne({ ambassadorId: userId });

        if (!ambassador) {
            return res.json(400).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }

        ambassador.avator = avator;
        await ambassador.save();

        return res.status(200).json({ success: true, message: 'AVATOR SELECTED' });
    } catch(err: unknown) {
        console.log('[BACKEND ERROR] error in getting leaderboard: ', err);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const verifyAmbassador = async (req: Request, res: Response) => {
    try {
        const { IGN, UID } = req.body;

        if (!IGN || !UID) {
            return res.status(400).json({ success: false, message: 'PROVIDE BOTH UID AND IGN' });
        }

        const userId = (req as any).userId;

        const isIGNAndUIDExists = await Ambassadors.findOne({ $or: [{ UID },{ IGN }] });

        if (isIGNAndUIDExists) {
            return res.status(400).json({ success: false, message: 'IGN OR UID ALREADY EXISTS' });
        }

        const userDossier = await Ambassadors.findOneAndUpdate({ ambassadorId: userId },{ IGN, UID });

        if (!userDossier) {
            return res.status(404).json({ success: false, message: 'OPERATIVE RECORD NOT FOUND' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { IGN, UID });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'OPERATIVE RECORD NOT FOUND' });
        }

        res.status(200).json({ success: true, message: 'AMBASSADOR VERIFIED' });
    } catch(err: unknown) {
        console.error('[BACKEND ERROR] error in getting leaderboard: ', err);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getLeaderBoard = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const userDossier = await Ambassadors.findOne({ ambassadorId: userId });
        let query: any = {};

        const topOperatives = await Ambassadors.find(query).sort({ rpLeaderBoardRank: 1 }).select('IGN RP rank collegeName city rpLeaderBoardRank').limit(50);

        res.status(200).json({ success: true, leaderboard: topOperatives, currentUserRank: userDossier?.rpLeaderBoardRank, currentUserRP: userDossier?.RP });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting leaderboard: ', err);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const submitTaskIntel = async (req: Request, res: Response) => {
    const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

    try {
        let { taskId, remarks, proofUrls } = req.body;
        const userId = (req as any).userId;
        const files = req.files as Express.Multer.File[];

        if (typeof proofUrls === 'string') {
            try {
                proofUrls = JSON.parse(proofUrls);
            } catch (e) {
                proofUrls = [];
            }
        }
        
        if (!Array.isArray(proofUrls)) {
            proofUrls = [];
        }

        const task = await Tasks.findById(taskId);
        if (!task) return res.status(404).json({ success: false, message: 'TASK DELETED' });

        if (task.isImageAllowed && (!files || files.length === 0)) {
            return res.status(400).json({ success: false, message: 'THIS MISSION REQUIRES SCREENSHOT PROOF.' });
        }

        if (task.status === 'Upcoming' || task.status === 'Completed') {
            return res.status(400).json({ success: false, message: `TASK IS ${task.status.toUpperCase()}. SUBMISSIONS NOT ACCEPTED.` });
        }

        const ambassador = await Ambassadors.findOne({ ambassadorId: userId });

        if (!ambassador) {
            return res.status(400).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }

        // if (taskId === "6a58c356457bea701ebd218c") {
        //     const submissions = await Submissions.find({ ambassadorId: ambassador._id, taskId });
            
        //     if(submissions?.length === 4) {
        //         return res.status(400).json({ success: false, message: 'YOU HAVE ALREADY SUBMITTED IT ENOUGH TIMES.' });
        //     } else {
        //         let count = 0;

        //         submissions.map((submission) => {
        //             count += submission.proofUrls.length;
        //         });

        //         if(count >= 4) {
        //             return res.status(400).json({ success: false, message: "YOU CAN ONLY SUBMIT A MAXIMUM OF 4 LINKS IN TOTAL" })
        //         }
        //     }
        // }


        const isLinkExists = await Submissions.findOne({ taskId, ambassadorId: ambassador._id, proofUrls: { $in: proofUrls } });

        if (isLinkExists) {
            return res.status(400).json({ success: false, message: "LINK ALREADY EXISTS" });
        }

        if (taskId === "6a9c16f3093c4e366e2e623f") {
            const [result] = await Submissions.aggregate([
                {
                    $match: {
                        ambassadorId: ambassador._id,
                        taskId
                    }
                },
                {
                    $unwind: {
                        path: "$proofUrls",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $count: "totalProofs"
                }
            ]);
        
            const totalProofs = result?.totalProofs ?? 0;
        
            if (totalProofs >= 4) {
                return res.status(400).json({ success: false, message: "YOU CAN ONLY SUBMIT A MAXIMUM OF 4 LINKS IN TOTAL" });
            }
        }

        const now = new Date();
        let period = 'once';

        if (task.taskType === 'Daily') {
            period = now.toISOString().split('T')[0];
        } 
        else if (task.taskType === 'Weekly') {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
            const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
        
            period = `${now.getFullYear()}-W${weekNum}`;
        }
        else if (task.taskType === 'Monthly') {
            period = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        } 
        else if (task.taskType === 'One-Time') {
            period = 'once';
        }

        const isTaskSubmitted = await Submissions.findOne({ 
            ambassadorId: ambassador._id, 
            taskId: task._id,
            submissionPeriod: period 
        });

        if (isTaskSubmitted && task.title !== "CAPTURE THE CLUTCH" && task.title !== "OFFLINE ACTIVATION") {
            return res.status(400).json({ success: false, message: `WINDOW CLOSED: YOU HAVE ALREADY SUBMITTED FOR THIS ${task.taskType.toUpperCase()} PERIOD.` });
        }

        const dossier = await Ambassadors.findOneAndUpdate(
            { ambassadorId: userId },
            { $inc: { 'stats.totalMissions': 1 } },
            { returnDocument: 'after' }
        );

        if (!dossier) return res.status(404).json({ success: false, message: 'AMBASSADOR NOT REGISTERED' });
        if (!DRIVE_FOLDER_ID) return res.status(500).json({ success: false, message: 'GOOGLE DRIVE FOLDER ID NOT CONFIGURED' });

        if (task.isImageAllowed && files) {
            for (const file of files) {
                const bufferStream = Readable.from(file.buffer);

                const driveResponse = await drive.files.create({
                    requestBody: {
                        name: `${dossier.IGN || 'ambassador'}_${Date.now()}_${file.originalname}`,
                        parents: [DRIVE_FOLDER_ID],
                    },
                    media: {
                        mimeType: file.mimetype,
                        body: bufferStream,
                    },
                    fields: 'id, webViewLink',
                });

                const { id: fileId, webViewLink } = driveResponse.data;

                if (fileId && webViewLink) {
                    await drive.permissions.create({
                        fileId,
                        requestBody: { role: 'reader', type: 'anyone' },
                    });
                    
                    proofUrls.push(webViewLink);
                }
            }
        }

        const submission = await Submissions.create({
            taskId,
            ambassadorId: dossier._id,
            proofUrls,
            remarks,
            submissionPeriod: period
        });

        const urls = proofUrls.join(', ');

        const sheetData = [[
            new Date().toLocaleString(),
            userId,
            dossier._id,
            submission._id,
            task.title,
            dossier.IGN,
            dossier.UID,
            urls,
        ]]

        await appendToGoogleSheets(process.env.TASK_GSHEET!, 'Submission Log Season 2!A:A', sheetData);

        res.status(201).json({ success: true, message: 'INTEL UPLOADED', submission });
        
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'WINDOW CLOSED: YOU HAVE ALREADY SUBMITTED FOR THIS PERIOD.' });
        }

        console.error('[BACKEND ERROR] Error in task submission: ', err);

        res.status(500).json({ success: false, message: 'UPLOAD FAILURE' });
    }
}

const getSubmissionIntel = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        
        const ambassador = await Ambassadors.findOne({ ambassadorId: userId });

        if(!ambassador) {
            return res.status(400).json({ success: false, message: 'AMBASSADOR PROFILE NOT FOUND' });
        }

        const submissions = (await Submissions.find({ ambassadorId: ambassador._id }).sort({ createdAt: -1 }).populate('taskId', 'title rpReward phase'));

        res.status(200).json({ success: true, submissions });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting submissions: ', err);

        const errMessage = 'MODERATION FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getRewardsCatalog = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const dossier = await Ambassadors.findOne({ ambassadorId: userId });
        const catalog = await Rewards.find();

        const rewardsWithStatus = catalog.map(reward => {
            const hasRank = (dossier?.maxRP ?? 0) >= reward.requiredRP;
            
            return {
                ...reward.toObject(),
                isLocked: !(hasRank)
            };
        });

        const rewardsWithStatusSeason1 = catalog.map(reward => {
            const hasRank = (dossier?.season1RP ?? 0) >= reward.requiredRP;
            
            return {
                ...reward.toObject(),
                isLocked: !(hasRank)
            };
        });

        res.status(200).json({ success: true, rewards: rewardsWithStatus, rewardsSeason1: rewardsWithStatusSeason1 });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting rewards catalog: ', err);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const ambassador = await Ambassadors.findOne({ ambassadorId: userId });

        if (!ambassador) {
            return res.status(400).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }

        const tasks = await Tasks.find({ status: 'In Progress' }).sort({ createdAt: -1 });

        const submittedTasks = await Submissions.find({ ambassadorId: ambassador._id });

        res.status(200).json({ success: true, tasks, submittedTasks });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting tasks: ', err);

        const errMessage = 'MODERATION FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getDashTasks = async (req: Request, res: Response) => {
    try {
        const phase = req.query.phase;

        if(!phase) {
            return res.status(400).json({ success: false, message: 'phase/season value was not provided' });
        }

        const tasks = await Tasks.find({ phase } as any);

        res.status(200).json({ success: true, tasks });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting dashboardtasks: ', err);

        const errMessage = 'MODERATION FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const sendNomination = async (req: Request, res: Response) => {
    const DRIVE_FOLDER_ID = process.env.NOMINATIONS_DRIVE_FOLDER_ID;

    try {
        const { playerUid, reasoning } = req.body;
        const files = req.files as Express.Multer.File[];

        const ambassador = await Ambassadors.findOne({ UID: playerUid });

        if(ambassador) {
            return res.status(400).json({ success: false, message: 'The entered player UID already exists as a ambassador' });
        }

        let proofUrls = [];

        if (!DRIVE_FOLDER_ID) return res.status(500).json({ success: false, message: 'GOOGLE DRIVE FOLDER ID NOT CONFIGURED' });

        for (const file of files) {
            const bufferStream = Readable.from(file.buffer);

            const driveResponse = await drive.files.create({
                requestBody: {
                    name: `${playerUid}_${Date.now()}_${file.originalname}`,
                    parents: [DRIVE_FOLDER_ID],
                },
                media: {
                    mimeType: file.mimetype,
                    body: bufferStream,
                },
                fields: 'id, webViewLink',
            });

            const { id: fileId, webViewLink } = driveResponse.data;

            if (fileId && webViewLink) {
                await drive.permissions.create({
                    fileId,
                    requestBody: { role: 'reader', type: 'anyone' },
                });
                
                proofUrls.push(webViewLink);
            }
        }

        const urls = proofUrls.join('\n');

        const sheetData = [[
            new Date().toLocaleString(),
            (req as any).userId,
            playerUid,
            reasoning,
            urls
        ]];

        await appendToGoogleSheets(process.env.NOMINATIONS_SHEET_ID!, 'Season 2!A1', sheetData);

        return res.status(200).json({ success: false, message: 'Nomination Created' });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in nominating player:', err);

        const errMessage = 'MODERATION FAILURE';

        return res.status(500).json({ success: false, message: errMessage });
    }
}

const registerPlayer = async (req: Request, res: Response) => {
    try {
        const { name, email, phoneNo, UID, MVPUID, cohort } = req.body;
        const files = (req as any).files;

        if (!name || !email || !phoneNo || !UID || !MVPUID) {
            return res.status(400).json({ success: false, message: 'SOME DETAILS ARE MISSING' });
        }

        const isAmbassadorExists = await Ambassadors.findOne({ UID });

        if (isAmbassadorExists) {
            return res.status(400).json({ success: false, message: 'MVP CANNOT SIGNUP AS A COHORT MEMBER' });
        }

        const isUserExists = await User.findOne({ email });

        if (isUserExists) {
            return res.status(400).json({ success: false, message: 'EMAIL ALREADY EXISTS AS A MVP' });
        }

        const isCohortMemberExistsWithEmail = await Cohort.findOne({ email });

        if (isCohortMemberExistsWithEmail) {
            return res.status(400).json({ success: false, message: "EMAIL ALREADY EXISTS" });
        }

        const isCohortMemberExistsWithPhoneNumber = await Cohort.findOne({ phoneNo });

        if (isCohortMemberExistsWithPhoneNumber) {
            return res.status(400).json({ success: false, message: "PHONE NUMBER ALREADY EXISTS" });
        }

        const ambassador = await Ambassadors.findOne({ UID: MVPUID });

        if (!ambassador) {
            return res.status(400).json({ success: false, message: 'INVALID MVP UID' });
        }

        const member = await Cohort.findOne({ UID });

        if(member) {
            return res.status(400).json({ sucess: false, message: 'UID IS ALREADY A PART OF A COHORT' });
        }

        let proofUrls: string[] = [];

        const DRIVE_FOLDER_ID = process.env.PLAYER_ID_FOLDER;

        if (!DRIVE_FOLDER_ID) {
            return res.status(500).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }
         
        if (files.length > 0) {
            for (const file of files) {
                const bufferStream = Readable.from(file.buffer);
    
                const driveResponse = await drive.files.create({
                    requestBody: {
                        name: `${name || 'player'}_${Date.now()}_${file.originalname}`,
                        parents: [DRIVE_FOLDER_ID],
                    },
                    media: {
                        mimeType: file.mimetype,
                        body: bufferStream,
                    },
                    fields: 'id, webViewLink',
                });
    
                const { id: fileId, webViewLink } = driveResponse.data;
    
                if (fileId && webViewLink) {
                    await drive.permissions.create({
                        fileId,
                        requestBody: { role: 'reader', type: 'anyone' },
                    });        
                    proofUrls.push(webViewLink);
                }
            }
        }

        // NOTE: Change the season value when the seasons cahnge
        await Cohort.create({
            mvp_id: ambassador._id,
            name,
            email,
            phoneNo,
            UID,
            MVPUID,
            idCardImage: proofUrls,
            cohort: 'Cohort-1',
            signupSeason: 'Season-2'
        });

        const MVP_ID = ambassador._id.toString();
        const urls = proofUrls.join('\n');

        const sheetsData = [[
            new Date().toLocaleString(),
            name,
            email,
            phoneNo,
            UID,
            MVPUID,
            urls,
            MVP_ID,
            'Season-2'
        ]];

        await appendPlayerToGoogleSheets(process.env.TASK_GSHEET!, 'Cohort Signups Season 2', sheetsData);

        return res.status(200).json({ success: true, message: 'PLAYER REGISTERED' });
    } catch(error: unknown) {
        console.log('[BACKEND ERROR] error in submitting player: ', error);

        const errMessage = 'INTERNAL SERVER ERROR';

        return res.status(500).json({ success: false, message: errMessage });
    }
}

const referFriend = async (req: Request, res: Response) => {
    try {
        const { name, course, college, convert, tournamentExp, phoneNo, email, hasTime, hasExperience, currentYear, accountRank, reasoning, experienceDetails, instagramUrl } = req.body;
        const MVPID = (req as any).userId;

        if (!name || !email || !phoneNo || !college || !course || !currentYear || !instagramUrl || !accountRank || !convert || !reasoning || !MVPID) {
            return res.status(400).json({ success: false, message: 'DETAILS MISSING' });
        }

        const isApplicationExists = await Applications.findOne({ $or: [{ email },{ phoneNo },{ instagramUrl }] });

        if (isApplicationExists) {
            return res.status(400).json({ success: false, message: 'EMAIL, PHONE NO. OR INSTAGRAM URL ALREADY EXISTS AS A APPLICATION' });
        }

        const isReferalExists = await Referals.findOne({ $or: [{ email },{ phoneNo },{ instagramUrl }] });

        if(isReferalExists) {
            return res.status(400).json({ success: false, message: 'EMAIL, PHONE NO. OR INSTAGRAM URL ALREADY EXISTS AS A REFERRAL' });
        }

        await Referals.create({ name, email, phoneNo, college, course, currentYear, instagramUrl, accountRank, hasTime, tournamentExp, convert, reasoning, MVPID, hasExperience, experienceDetails });

        const amb = await Ambassadors.findOne({ ambassadorId: MVPID });

        const MVPUID = amb?.UID;
        const MVPIGN = amb?.IGN;

        const sheetData = [[
            new Date().toLocaleString(),
            name,
            email,
            phoneNo,
            college,
            course,
            currentYear,
            instagramUrl,
            accountRank,
            hasTime,
            tournamentExp,
            convert,
            reasoning,
            hasExperience,
            experienceDetails,
            MVPUID,
            MVPIGN,
            MVPID
        ]];

        await appendToGoogleSheets(process.env.PLAYER_REFERALS_SHEET!, 'Sheet1!A1', sheetData);

        return res.status(200).json({ success: true, message: 'REFERAL INITIATED' });
    } catch(error: any) {
        console.log('[BACKEND ERROR] error in refering your friend', error);

        const errMessage = 'INTERNAL SERVER ERROR';

        return res.status(500).json({ success: false, message: errMessage });
    }
}

const getMyReferals = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        if (!userId) {
            return res.status(500).json({ success: false, message: "User not found" });
        }

        const referals = await Referals.find({ MVPID: userId });

        return res.status(200).json({ success: true, referals, message: "REFERALS FETCHED" });
    } catch(error: unknown) {
        console.error('[BACKEND ERROR] Error in fetching referals', error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getCohort = async (req: Request, res: Response) => {
    try {
        const mvp = (req as any).userId

        const ambassador = await Ambassadors.findOne({ ambassadorId: mvp });

        if(!ambassador) {
            return res.status(400).json({ success: false, message: 'COULD NOT FIND AMBASSADOR' });
        }

        const cohorts = await Cohort.find({ mvp_id: ambassador._id });

        return res.status(200).json({ success: false, message: 'COHORTS FETCHED', cohorts })
    } catch (err: unknown) {
        console.log('[BACKEND ERROR] error in fetching cohort', err);

        const errMessage = 'INTERNAL SERVER ERROR';

        return res.status(500).json({ success: false, message: errMessage });
    }
}

const deleteCohortPlayer = async (req: Request, res: Response) => {
    try {
        const { cohortId } = req.params;

        if(!cohortId) {
            return res.status(400).json({ success: false, message: 'SOMETHING WENT WRONG!' });
        }

        const deletedCohort = await Cohort.findByIdAndDelete(cohortId);

        if (!deletedCohort) {
            return res.status(400).json({ success: false, message: 'TASK NOT FOUND' });
        }

        return res.status(200).json({ success: true, message: 'TASK DELETED' });
    } catch (err: unknown) {
        console.log('[BACKEND] error in fetching cohort', err);

        const errMessage = 'INTERNAL SERVER ERROR';

        return res.status(500).json({ success: false, message: errMessage });
    }
}

const leaderboardForSpecificTask = async (req: AuthRequest, res: Response) => {
    try {
        const ambassadors = await Ambassadors.find({});

        const sortedAmbassadors = ambassadors.sort((a,b) => a.xpForSpecificTask - b.xpForSpecificTask);

        const ambassadorsForLeaderboard = sortedAmbassadors.filter(ambassador => ambassador.xpForSpecificTask > 0);

        return res.status(200).json({ success: true, ambassadorsForLeaderboard, message: "Leaderboard for specific task" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const submitSpecificTask = async (req: AuthRequest, res: Response) => {
    try {
        const { proofUrls, taskId } = req.body;
        const userId = req.userId;

        if (!proofUrls || !taskId || !userId) {
            return res.status(400).json({ success: false, message: "Details missing" });
        }

        if (proofUrls.length < 1) {
            return res.status(400).json({ success: false, message: "Link section can't be empty" });
        }

        const ambassador = await Ambassadors.findOne({ ambassadorId: userId });

        if (!ambassador) {
            return res.status(400).json({ success: false, message: "Ambassador not found" });
        }

        const task = await Tasks.findById(taskId);

        if (!task) {
            return res.status(400).json({ success: false, message: "Task not found" });
        }

        const isSubmissionExists = await Submissions.findOne({ ambassadorId: ambassador._id, taskId });

        const now = new Date();
        let period = 'once';

        if (task.taskType === 'Daily') {
            period = now.toISOString().split('T')[0];
        } 
        else if (task.taskType === 'Weekly') {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
            const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
        
            period = `${now.getFullYear()}-W${weekNum}`;
        }
        else if (task.taskType === 'Monthly') {
            period = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        } 
        else if (task.taskType === 'One-Time') {
            period = 'once';
        }

        let submission;

        if (isSubmissionExists) {
            isSubmissionExists.proofUrls.push(...proofUrls);
            await isSubmissionExists.save();
        } else {
            submission = await Submissions.create({ taskId, ambassadorId: ambassador._id, proofUrls, submissionPeriod: period });
        }

        let submissionId;

        if (submission) {
            submissionId = submission._id;
        } else {
            submissionId = isSubmissionExists?._id;
        }

        const urls = proofUrls.join(', ');

        const sheetData = [[
            new Date().toLocaleString(),
            userId,
            ambassador._id,
            submissionId,
            task.title,
            ambassador.IGN,
            ambassador.UID,
            urls,
        ]];

        await appendToGoogleSheets(process.env.TASK_GSHEET!, 'Submission Log Season 2!A:A', sheetData);

        res.status(201).json({ success: true, message: 'INTEL UPLOADED', submission });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getSpecificTasks = async (req: Request, res: Response) => {
    try {
        const ids = ["6ac0d3becfe49cb80aa65d83","6ac0d9bfc6e5c085e2ee3e9f"];

        const tasks = await Tasks.find({ _id: { $in: ids }});

        return res.status(200).json({ success: true, tasks, message: "SPECIFIC TASK FETCHED" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "INTERNAL SERVER ERROR" });
    }
}

export { getDashboardSync, getLeaderBoard, submitTaskIntel, getRewardsCatalog, getTasks, getSubmissionIntel, verifyAmbassador, getDashTasks, chooseAvator, registerPlayer, referFriend, getMyReferals, sendNomination, getCohort, deleteCohortPlayer, leaderboardForSpecificTask, submitSpecificTask, getSpecificTasks }