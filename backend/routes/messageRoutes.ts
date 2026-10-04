import express from 'express';

const router = express.Router();

import authRole from '../middleware/authRole.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getAdminContacts, getAmbassadorContacts, getMessages, sendMessage } from '../controllers/messageControllers.js';

router.get('/', authMiddleware, authRole('Admin'), getAdminContacts);
router.get('/ambassador', authMiddleware, authRole('Ambassador'), getAmbassadorContacts);
router.get('/:receiverId', authMiddleware, getMessages);
router.post('/', authMiddleware, sendMessage);

export default router;