import express from 'express';

const router = express.Router();

import authRole from '../middleware/authRole.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { submitApplication, getApplications, updateApplicationStatus, getReferals, updateReferalStatus } from '../controllers/applicationControllers.js';

router.get('/', authMiddleware, authRole('Admin'), getApplications);
router.get('/referals', authMiddleware, authRole('Admin'), getReferals);
router.post('/submit', submitApplication);
router.patch('/referals/:id', authMiddleware, authRole('Admin'), updateReferalStatus);
router.patch('/:id', authMiddleware, authRole('Admin'), updateApplicationStatus);

export default router;