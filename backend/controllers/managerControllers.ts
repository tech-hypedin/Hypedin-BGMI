import User from "../models/userModels.js";
import Tasks from '../models/tasksModel.js';
import Submissions from '../models/submissionsModel.js'

import type { Request, Response } from 'express';

type TaskStatus = 'Upcoming' | 'In Progress' | 'In Review' | 'Completed'

const getTasksByStatus = async (req: Request, res: Response) => {
    try {
        const tab = req.query.tab as TaskStatus;

        if(tab === 'In Review') {
            const submissions = await Submissions.find({ status: { $in: ['Pending', 'Rejected'] } }).populate('ambassadorId', 'rank IGN').populate('taskId', 'title rpReward');

            return res.status(200).json({ success: true, tasks: submissions });
        }

        if(tab === 'Completed') {
            const submissions = await Submissions.find({ status: 'Approved' }).populate('ambassadorId', 'rank IGN').populate('taskId', 'title rpReward');

            return res.status(200).json({ success: true, tasks: submissions });
        }

        const tasks = await Tasks.find({ status: tab }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, tasks });
    } catch (err: unknown) {
        console.error('[BACKEND] error in getting tasks for managers: ', err);

        const errMessage = err instanceof Error ? err.message : 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

export { getTasksByStatus }