import sanitizeHtml from 'sanitize-html';

import Ambassadors from '../models/ambassadorModel.js';
import User from '../models/userModels.js';
import Groups from '../models/groupModel.js';
import Messages from '../models/messagesModel.js';

import { io } from '../app.js';

import type { Request, Response } from 'express';

const getAdminContacts = async (req: Request, res: Response) => {
    try {
        const group = await Groups.find({ groupType: 'global' });
        const ambassadors = await Ambassadors.find().populate('ambassadorId');

        res.status(200).json({ success: true, contacts: { group, individuals: ambassadors } });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting admin contacts: ', err);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getAmbassadorContacts = async (req: Request, res: Response) => {
    try {
        const group = await Groups.find({ groupType: 'global' });
        const admins = await User.find({ role: 'Admin' }).select('-mustChangePassword');

        res.status(200).json({ success: true, contacts: { group, individuals: admins } });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting ambassador contacts: ', err);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const getMessages = async (req: Request, res: Response) =>  {
    try {
        const { receiverId } = req.params;
        const userId = (req as any).userId;

        const messages = await Messages.find({
            $or: [
                { receiverId: receiverId, onModel: 'Group' },
                { senderId: userId, receiverId: receiverId, onModel: 'User' },
                { senderId: receiverId, receiverId: userId, onModel: 'User' }
            ]
        }).sort({ createdAt: 1 }).populate('senderId', 'IGN role');

        res.status(200).json({ success: true, messages });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in getting messages for chat: ', err);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const sendMessage = async (req: Request, res: Response) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = (req as any).userId; 

        const senderAccount = await User.findById(senderId);

        if (!senderAccount) {
            return res.status(401).json({ success: false, message: 'UNAUTHORIZED SENDER' });
        }

        let senderDisplayName = '';

        if (senderAccount.role === 'Admin') {
            senderDisplayName = senderAccount.email.split('@')[0].toUpperCase();
        } else {
            const ambassadorProfile = await Ambassadors.findOne({ ambassadorId: senderId });
            senderDisplayName = senderAccount.email.split('@')[0];
        }

        const receiverAsUser = await User.findById(receiverId);
        const receiverAsGroup = await Groups.findById(receiverId);

        if (!receiverAsUser && !receiverAsGroup) {
            return res.status(404).json({ success: false, message: 'TARGET NOT FOUND' });
        }

        const onModel = receiverAsGroup ? 'Group' : 'User';

        const sanitizedMessage = sanitizeHtml(message, {
            allowedTags: [],
            allowedAttributes: {}
        });

        const newMessage = await Messages.create({ senderId, receiverId, message: sanitizedMessage, onModel });
        
        const socketPayload = {
            ...newMessage.toObject(),
            senderId: {
                _id: senderAccount._id,
                role: senderAccount.role
            },
            senderName: senderDisplayName,
            senderRole: senderAccount.role
        }

        io.to(receiverId.toString()).emit('newMessage', socketPayload);

        return res.status(201).json({ success: true, newMessage: socketPayload });
    } catch (err: any) {
        console.error('[BACKEND ERROR] error in sending message: ', err);

        const errMessage = 'LOGISTICS FAILURE';

        res.status(500).json({ success: false, message: errMessage });
    }
}

export { getAdminContacts, getAmbassadorContacts, getMessages, sendMessage }