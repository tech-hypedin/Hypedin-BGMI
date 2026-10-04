import express from 'express';

const router = express.Router();

import authRole from '../middleware/authRole.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { createTask, getTasksByStatus, getRewardInventory, createReward, reviewSubmission, getSubmission, getLeaderboard, deleteTask, getTasks } from '../controllers/adminControllers.js';

router.get('/rewards', authMiddleware, authRole('Admin'), getRewardInventory);
router.get('/tasks', authMiddleware, authRole('Admin'), getTasks);
router.get('/task', authMiddleware, authRole('Admin'), getTasksByStatus);
router.get('/submissions/:taskId', authMiddleware, authRole('Admin'), getSubmission);
router.get('/leaderboard', authMiddleware, authRole('Admin'), getLeaderboard);
router.post('/rewards', authMiddleware, authRole('Admin'), createReward);
router.post('/task', authMiddleware, authRole('Admin'), createTask);
router.delete('/task/:taskId', authMiddleware, authRole('Admin'), deleteTask);
router.post('/submissions', authMiddleware, authRole('Admin'), reviewSubmission);

export default router;