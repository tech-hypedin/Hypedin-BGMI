import express from 'express';

const router = express.Router();

import authMiddleware from '../middleware/authMiddleware.js';
import { changePassword, login, setupFirstPassword, logout } from '../controllers/authControllers.js';

router.post('/login', login);
router.post('/logout', logout);
router.post('/change', authMiddleware, changePassword);
router.post('/setup', authMiddleware, setupFirstPassword);

export default router;