import { Readable } from "stream";

import NominationModel from "../models/nominationModel.js";
import { drive } from "../utils/googleDrive.js";
import { appendToGoogleSheets } from "../utils/sheetsTracker.js";
import Ambassadors from "../models/ambassadorModel.js";

import type { Request, Response } from "express";
import User from "../models/userModels.js";

const nominatePlayer = async (req: Request, res: Response) => {
    const DRIVE_FOLDER_ID = process.env.NOMINATIONS_DRIVE_FOLDER_ID;

    try {
        const { playerName, playerNumber, playerEmail, playerUID, reasoning } = req.body;
        const season = (req.query.season as "1" | "2" | "3");
        const userId = (req as any).userId;
        const files = req.files as Express.Multer.File[];

        if (!playerName || !playerNumber || !playerEmail || !playerUID || !reasoning || !season || !userId || !files || files.length < 1 ) {
            return res.status(400).json({ success: false, message: "Details Missing" });
        }

        const existingNomination = await NominationModel.findOne({ season, $or: [{ userId }, { playerEmail }, { playerUID },{ playerNumber }] });

        if (existingNomination) {
            return res.status(400).json({ success: false, message: "PLAYER HAS BEEN ALREADY NOMINATED" });
        }

        const isPlayerExists = await NominationModel.findOne({ $or: [{ playerEmail, season },{ playerUID, season },{ playerEmail, playerUID, season }] });

        if (isPlayerExists) {
            return res.status(400).json({ success: false, message: "PLAYER ALREADY EXISTS" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(500).json({ success: false, message: "USER NOT FOUND" });
        }

        const ambassador = await Ambassadors.findOne({ UID: playerUID });

        if(ambassador) {
            return res.status(400).json({ success: false, message: 'The entered player UID already exists as a ambassador' });
        }

        let proofURL: string[] = [];

        if (!DRIVE_FOLDER_ID) {
            throw new Error("FOLDER ID NOT FOUND");
        }

        for (const file of files) {
            const bufferStream = Readable.from(file.buffer);
        
            const driveResponse = await drive.files.create({
                requestBody: {
                    name: `${playerUID}_${Date.now()}_${file.originalname}`,
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
                        
                proofURL.push(webViewLink);
            }
        }

        const URLs = proofURL.join('\n');

        await NominationModel.create({ userId, playerName, playerNumber, MVPUID: user.UID, playerEmail, playerUID, reasoning, season, proofURL });

        const sheetData = [[
            new Date().toLocaleString(),
            (req as any).userId,
            user.UID,
            playerName,
            playerEmail,
            playerNumber,
            playerUID,
            reasoning,
            URLs
        ]];

        await appendToGoogleSheets(process.env.NOMINATIONS_SHEET_ID!, 'Season 2!A1', sheetData);

        return res.status(200).json({ success: true, message: "PLAYER SUCCESSFULLY NOMINATED" });
    } catch(error: unknown) {
        console.error('[BACKEND ERROR] error in nominatePlayer', error);

        return res.status(500).json({ success: false, message: "INTERNAL SERVER ERROR" });
    }
}

const checkForNominatedPlayer = async (req: Request, res: Response) => {
    try {
        const season = (req.query.season as "1" | "2" | "3");
        const userId = (req as any).userId;

        if (!season || !userId) {
            return res.status(400).json({ success: false, message: "Something went wrong" });
        }

        const existingNomination = await NominationModel.findOne({ userId, season });

        if (existingNomination) {
            return res.status(200).json({ success: true, isNominationExists: true, message: "PLAYER ALREADY NOMINATED" });
        }

        return res.status(200).json({ success: true, isNominationExists: false, message: "NOMINATION DOESN'T EXISTS" });
    } catch(error: unknown) {
        console.error('[BACKEND ERROR] error in checkForNominatedPlayer', error);

        return res.status(500).json({ success: false, message: "INTERNAL SERVER ERROR" });
    }
}

export { nominatePlayer, checkForNominatedPlayer }