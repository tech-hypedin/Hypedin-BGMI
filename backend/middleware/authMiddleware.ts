import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import User from '../models/userModels.js';

interface JwtPayload {
    userId: string;
    role: string;
}

export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.token; 

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'SIGNAL LOST: NO HTTP-ONLY COOKIE DETECTED' 
            });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const user = await User.findById(payload.userId).select('role');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'OPERATIVE DE-RANKED: USER NO LONGER EXISTS' 
            });
        }

        req.userId = payload.userId;
        req.userRole = user.role;

        next();
    } catch (err) {
        return res.status(401).json({ 
            success: false, 
            message: 'ENCRYPTION MISMATCH: SESSION EXPIRED OR INVALID' 
        });
    }
}

export default authMiddleware;