import express from 'express';
import { submitContactForm } from '../controllers/contactFormControllers.js';

const router = express.Router();

router.post('/submitQuery', submitContactForm);

export default router;