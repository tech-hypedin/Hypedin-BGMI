import User from '../models/userModels.js';

import { request, type Request, type Response } from 'express';

interface LoginBody {
    userId?: string,
    email?: string,
    password?: string
}

const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ success: false, message: 'CREDENTIALS MISSING: PLEASE PROVIDE EMAIL AND CIPHER' });
        }

        const user = await User.findOne({ email }).select('+password');

        if(!user) {
            return res.status(400).json({ success: false, message: 'IDENTIFICATION FAILED: OPERATIVE NOT FOUND' });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if(!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: 'ACCESS DENIED: INVALID SECURITY CIPHER' });
        }
    
        const token = await user.createJWT();
    
        const { password: _, ...resUser } = user.toObject();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.cookie('userDetails', resUser, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
    
        res.status(200).json({ success: true, message: 'AUTHENTICATION SUCCESSFUL. WELCOME TO THE FRONT LINE.', mustChangePassword: user.mustChangePassword, resUser: resUser });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in logging in: ', err);

        const errMessage = 'SIGNAL INTERRUPTED: INTERNAL SERVER ERROR';

        res.status(500).json({ success: false, message: errMessage });
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token');
        res.clearCookie('userDetails');

        return res.status(200).json({ success: true });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in deleting user cookies: ', err);

        res.status(500).json({ success: false, message: 'ENCRYPTION ERROR: PROTOCOL FAILED' });
    }
}

const setupFirstPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const userId = (req as any).userId;

        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, message: 'WEAK CIPHER: PASSWORD MUST BE AT LEAST 8 CHARACTERS' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'OPERATIVE NOT FOUND' });
        }

        user.password = password;
        
        user.mustChangePassword = false;
        await user.save();

        const { password: _, ...resUser } = user.toObject();

        res.cookie('userDetails', resUser, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true, message: 'SECURITY OVERRIDE COMPLETE: ACCESS GRANTED TO ALL SECTORS', resUser: resUser._id });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in setting up password on first login: ', err);

        res.status(500).json({ success: false, message: 'ENCRYPTION ERROR: PROTOCOL FAILED' });
    }
}

const changePassword = async (req: Request, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if(!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'PROTOCOL UPDATE FAILED: DATA MISSING' });
        }

        const userId = (req as any).userId;

        const user = await User.findById(userId).select('+password');

        if(!user) {
            return res.status(404).json({ success: false, message: 'OPERATIVE NOT FOUND' });
        }

        const isMatch = await user.comparePassword(oldPassword);

        if(!isMatch) {
            return res.status(400).json({ success: false, message: 'AUTHORIZATION FAILED: OLD CIPHER INCORRECT' });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({ success: false, message: 'REDUNDANCY DETECTED: NEW CIPHER MUST BE UNIQUE' });
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({ success: true, message: 'SECURITY PROTOCOL UPDATED SUCCESSFULLY' });
    } catch (err: unknown) {
        console.error('[BACKEND ERROR] error in changing password: ', err);

        const errMessage = 'ENCRYPTION ERROR: COULD NOT UPDATE PASSWORD';

        res.status(500).json({ success: false, message: errMessage });
    }
}

export { login, changePassword, setupFirstPassword, logout }