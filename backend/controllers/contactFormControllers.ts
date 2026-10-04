import type { Request, Response } from 'express';
import { appendToGoogleSheetsForContactForm } from '../utils/sheetsTracker.js';

const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { fullName, email, description, issueCategory } = req.body;

        if (!fullName || !email || !issueCategory || !description) {
            return res.status(400).json({ success: false, message: 'PLEASE FILL NAME, EMAIL AND ISSUE CATEGORY' });
        }

        const sheetData = [[
            new Date().toLocaleString(),
            fullName,
            email,
            description,
            issueCategory
        ]];

        await appendToGoogleSheetsForContactForm(process.env.GOOGLE_SHEETS_ID_FOR_CONTACT_FORM!, 'Sheet1!A1', sheetData);
        return res.status(200).json({ success: true, message: 'QUERY REGISTERED' });
    } catch(error: any) {
        console.log('[BACKEND ERROR] error in contact form: ', error);

        const errMessage = 'Internal server error';
        
        return res.status(500).json({ success: false, message: errMessage });
    }
}

export { submitContactForm }