import express from 'express';

const router = express.Router();

import authRole from '../middleware/authRole.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getTasksByStatus } from '../controllers/managerControllers.js';

router.get('/', authMiddleware, authRole('Manager'), getTasksByStatus);

export default router;