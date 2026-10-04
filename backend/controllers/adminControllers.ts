import Tasks from '../models/tasksModel.js';
import Rewards from '../models/rewardsModel.js';
import Submissions from '../models/submissionsModel.js';
import Ambassadors from '../models/ambassadorModel.js';

import type { Request, Response } from 'express';

const createTask = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).userId;
        const { phase, title, description, rpReward, subGuide, category, taskType, rewards, deadline, status, startDate, isImageAllowed } = req.body;
        
        const newTask = await Tasks.create({
            phase,
            title,
            description,
            rpReward,
            subGuide,
            category,
            taskType,
            rewards,
            deadline,
            createdBy: adminId,
            status: status || 'In Progress',
            startDate,
            isImageAllowed
        });

        res.status(201).json({ success: true, message: 'OBJECTIVE DEPLOYED', newTask });
    } catch (err) {
        console.error('[BACKEND ERROR] error in task creation: ', err);

        const errMessage = err instanceof Error ? err.message : 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
};

const getTasksByStatus = async (req: Request, res: Response) => {
    try {
        const tab = req.query.tab as string;

        if(tab === 'In Review') {
            const submissions = await Submissions.find({ status: { $in: ['Pending', 'Rejected'] } }).populate('ambassadorId', 'rank IGN').populate('taskId', 'title rpReward phase');

            return res.status(200).json({ success: true, tasks: submissions });
        }

        if(tab === 'Completed') {
            const submissions = await Submissions.find({ status: 'Approved' }).populate('ambassadorId', 'rank IGN').populate('taskId', 'title rpReward phase');

            return res.status(200).json({ success: true, tasks: submissions });
        }

        const tasks = await Tasks.find({ status: tab as any }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, tasks });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting tasks: ', err);

        const errMessage = err instanceof Error ? err.message : 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getRewardInventory = async (req: Request, res: Response) => {
    try {
        const inventory = await Rewards.find({});
        res.status(200).json({ 
            success: true, 
            inventory,
            totalAssets: inventory.length 
        });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting task inventory: ', err);

        const errMessage = err instanceof Error ? err.message : 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const createReward = async (req: Request, res: Response) => {
    try {
        const { title, requiredRank, requiredRP, rewardType, isAutoUnlocked } = req.body;
        
        const asset = await Rewards.create({
            title,
            requiredRank,
            requiredRP,
            rewardType,
            isAutoUnlocked
        });

        res.status(201).json({ success: true, message: 'ASSET INITIALIZED', asset });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in reward creation: ', err);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const reviewSubmission = async (req: Request, res: Response) => {
    try {
        const { subId, status, adminFeedback } = req.body; 
        const adminId = (req as any).userId;

        const submission = await Submissions.findById(subId).populate('taskId');

        if (!submission) {
            return res.status(404).json({ success: false, message: 'INTEL NOT FOUND' });
        }

        if (submission.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'MISSION ALREADY PROCESSED' });
        }

        submission.status = status;
        submission.adminFeedback = adminFeedback || 'No feedback provided.';
        submission.reviewedBy = adminId;
        await submission.save();

        if (status === 'Approved') {
            const taskReward = (submission.taskId as any)?.rpReward || 0;
            const MAX_RP_THRESHOLD = 6000;

            const ambassador = await Ambassadors.findById(submission.ambassadorId);

            if (ambassador) {
                ambassador.RP = ambassador.RP || 0;
                ambassador.XP = ambassador.XP || 0;

                const rpSpaceRemaining = Math.max(0, MAX_RP_THRESHOLD - ambassador.RP);

                if (rpSpaceRemaining === 0) {
                    ambassador.XP += taskReward;
                } else if (taskReward > rpSpaceRemaining) {
                    ambassador.RP += rpSpaceRemaining;
                    
                    const remainingReward = taskReward - rpSpaceRemaining;
                    ambassador.XP += remainingReward;
                } else {
                    ambassador.RP += taskReward;
                }

                ambassador.stats.missionsCompleted += 1;
                await ambassador.save(); 
            }
        }

        return res.status(200).json({ success: true, message: `MISSION ${status.toUpperCase()} SUCCESSFULLY` });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in review submission: ', err);

        const errMessage = 'MODERATION FAILURE';

        return res.status(500).json({ success: false, message: errMessage });
    }
}

const getSubmission = async (req: Request, res: Response) => {
    try {
        const {taskId: subId} = req.params;

        const submission = await Submissions.findById({ _id: subId }).populate('ambassadorId');

        res.status(200).json({ success: true, submission });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting submissions: ', err);

        const errMessage = 'MODERATION FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Tasks.find({});

        return res.status(200).json({ success: true, tasks, message: "TASKS FETCHED" });
    } catch(error: unknown) {
        console.error('{BACKEND ERROR] Error in fetching tasks for admin: ', error);

        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getLeaderboard = async (req: Request, res: Response) => {
    try {
        let query: any = {};
        const topOperatives = await Ambassadors.find(query).sort({ rpLeaderBoardRank: 1 }).select('IGN RP rank collegeName city rpLeaderBoardRank').limit(50);

        res.status(200).json({ status: 200, leaderboard: topOperatives });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting leaderboard: ', err);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const deleteTask = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;

        if (!taskId) {
            return res.status(400).json({ success: false, message: 'SOMETHING WENT WRONG' });
        }

        const deletedTask = await Tasks.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(400).json({ success: false, message: 'TASK NOT FOUND' });
        }

        return res.status(200).json({ success: true, message: 'TASK DELETED' });
    } catch(err: unknown) {
        console.log('[BACKEND ERROR] error in task deletion: ', err);

        const errMessage = err instanceof Error ? err.message : 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

export { createTask, getTasksByStatus, getRewardInventory, createReward, reviewSubmission, getSubmission, getLeaderboard, deleteTask, getTasks }