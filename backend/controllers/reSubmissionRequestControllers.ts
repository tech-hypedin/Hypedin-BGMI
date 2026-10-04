import type { Request, Response } from "express";
import ReSubmissionRequest from "../models/reSubmissionRequestsModel.js";
import Ambassadors from "../models/ambassadorModel.js";
import Submissions from "../models/submissionsModel.js";
import Tasks from "../models/tasksModel.js";
import { drive } from "../utils/googleDrive.js";
import { Readable } from "stream";
import User from "../models/userModels.js";
import { sendReSubmissionRequestAcceptedEmail, sendReSubmissionRequestRejectionMail } from "../utils/mailer.js";
import Applications from "../models/applicationsModel.js";

const createReSubmissionRequest = async (req: Request, res: Response) => {
    try {
        const { taskId, reason } = req.body;
        const userId = (req as any).userId;

        if (!taskId || !userId || !reason) {
            return res.status(400).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }

        const ambassador = await Ambassadors.findOne({ ambassadorId: userId });

        if (!ambassador) {
            return res.status(400).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }

        const hasReSubmitted = await ReSubmissionRequest.findOne({ taskId, ambassadorId: ambassador._id });

        if (hasReSubmitted) {
            return res.status(400).json({ success: false, message: 'TASK CANNOT BE RE-SUBMITTED AGAIN' });
        }

        await ReSubmissionRequest.create({ taskId, ambassadorId: ambassador._id, reason });

        return res.status(200).json({ success: true, message: 'REQUESTED SUCCESSFULLY' });
    } catch(error: unknown) {
        console.log('[BACKEND ERROR] error in getting tasks: ', error);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getReSubmissionRequests = async (req: Request, res: Response) => {
    try {
        const taskRequests = await ReSubmissionRequest.find({ isRevertBack: false }).populate("taskId", "title").populate({ path: "ambassadorId", populate: { path: "ambassadorId", select: "email" }});

        return res.status(200).json({ success: true, taskRequests, message: 'ALL TASK REQUESTS' });
    } catch(error: unknown) {
        console.log('[BACKEND ERROR] error in getting requests: ', error);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getRevertBackRequests = async (req: Request, res: Response) => {
    try {
        const revertBackRequests = await ReSubmissionRequest.find({ isRevertBack: true });

        return res.status(200).json({ success: true, revertBackRequests, message: 'ALL REVERT BACK REQUESTS' });
    } catch(error: unknown) {
        console.log('[BACKEND ERROR] error in getting revert back requests: ', error);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getMyReSubmissionRequests = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        if (!userId) {
            return res.status(500).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }

        const ambassador = await Ambassadors.findOne({ ambassadorId: userId });

        if (!ambassador) {
            return res.status(500).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }

        const myReSubmissionRequests = await ReSubmissionRequest.find({ ambassadorId: ambassador._id }).populate("taskId","title");

        return res.status(200).json({ success: true, myReSubmissionRequests, message: 'YOUR RE-SUBMISSION REQUESTS' });
    } catch(error: unknown) {
        console.log('[BACKEND ERROR] error in getting your requests: ', error);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const revertReSubmissionRequest = async (req: Request, res: Response) => {
    try {
        const { isAccepted, reSubmissionRequestId } = req.body;

        if (!reSubmissionRequestId) {
            return res.status(200).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }

        const reSubmissionRequest = await ReSubmissionRequest.findById(reSubmissionRequestId);

        if (!reSubmissionRequest || reSubmissionRequest.isRevertBack) {
            return res.status(400).json({ success: false, message: 'INVALID PROCESS' });
        }

        const task = await Tasks.findById(reSubmissionRequest.taskId);

        if (!task) {
            return res.status(500).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }

        const ambassador = await Ambassadors.findById(reSubmissionRequest.ambassadorId);

        if (!ambassador) {
            return res.status(500).json({ success: false, message: 'AMBASSADOR NOT FOUND' });
        }

        const user = await User.findById(ambassador.ambassadorId);

        if (!user) {
            return res.status(500).json({ success: false, message: 'USER NOT FOUND' });
        }

        const userApplication = await Applications.findOne({ email: user.email });

        if (!userApplication) {
            return res.status(500).json({ success: false, message: 'DETALS NOT FOUND' });
        }

        reSubmissionRequest.isAccepted = isAccepted;
        reSubmissionRequest.isRevertBack = true;
        await reSubmissionRequest.save();

        if (isAccepted) {
            await sendReSubmissionRequestAcceptedEmail(user.email, userApplication.name, task.title);
        }

        return res.status(200).json({ success: true, message: 'REVERT HAS BEEN SENT' });
    } catch(error: unknown) {
        console.log('[BACKEND ERROR] error in accepting the re-submission request');

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const reSubmitTask = async (req: Request, res: Response) => {
    try {
        let { taskId, reSubmissionRequestId, proofUrls } = req.body;
        const userId = (req as any).userId;
        const files = req.files as Express.Multer.File[];

        if (!taskId || !reSubmissionRequestId || !userId || !proofUrls) {
            return res.status(400).json({ success: false, message: "SOMETHING WENT WRONG" });
        }

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

        const ambassador = await Ambassadors.findOne({ ambassadorId: userId });

        if (!ambassador) {
            return res.status(400).json({ success: false, message: "SOMETHING WENT WRONG" });
        }

        const reSubmissionRequest = await ReSubmissionRequest.findById(reSubmissionRequestId);

        if (!reSubmissionRequest || !reSubmissionRequest.isAccepted || reSubmissionRequest.isReSubmitted) {
            return res.status(400).json({ success: false, message: "INVALID PROCESS" });
        }

        const task = await Tasks.findById(taskId);

        if (!task) {
            return res.status(400).json({ success: false, message: "TASK NOT FOUND" });
        }

        if (task.status === 'Upcoming' || task.status === 'Completed') {
            return res.status(400).json({ success: false, message: `TASK IS ${task.status.toUpperCase()}. SUBMISSIONS NOT ACCEPTED.` });
        }

        if (task.isImageAllowed && (!files || files.length === 0)) {
            return res.status(400).json({ success: false, message: "THIS MISSION REQUIRES SCREENSHOT PROOF." });
        }

        const submission = await Submissions.findOne({ taskId, ambassadorId: ambassador._id });

        if (!submission) {
            return res.status(400).json({ success: false, message: "SOMETHING WENT WRONG" });
        }

        if (submission.status !== "Rejected") {
            return res.status(400).json({ success: false, message: "TASK CAN'T BE RESUBMITTED" });
        }
        
        const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

        if (!DRIVE_FOLDER_ID) {
            return res.status(500).json({ success: false, message: "SOMETHING WENT WRONG" });
        }

        if (task.isImageAllowed && files) {
            for (const file of files) {
                const bufferStream = Readable.from(file.buffer);
        
                const driveResponse = await drive.files.create({
                    requestBody: {
                        name: `${ambassador.IGN || 'ambassador'}_${Date.now()}_${file.originalname}`,
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

        submission.proofUrls = proofUrls;
        submission.status = "Pending";
        await submission.save();

        reSubmissionRequest.isReSubmitted = true;
        await reSubmissionRequest.save();

        return res.status(200).json({ success: true, message: "Task successfully Resubmitted" });
    } catch(error: unknown) {
        console.log('[BACKEND ERROR] error in resubmitting task');

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

export { createReSubmissionRequest, revertReSubmissionRequest, getReSubmissionRequests, getRevertBackRequests, getMyReSubmissionRequests, reSubmitTask }