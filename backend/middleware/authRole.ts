import type { Request, Response, NextFunction } from 'express';

// Define a custom interface to avoid 'any'
interface AuthenticatedRequest extends Request {
    userRole?: string;
}

const authorizeRole = (...allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userRole } = req;

        // 1. Check for role existence
        if (!userRole) {
            return res.status(401).json({ 
                success: false, 
                message: 'SIGNAL LOST: AUTHENTICATION REQUIRED' 
            });
        }

        // 2. Tactical Role Verification
        const hasAccess = allowedRoles.includes(userRole);

        if (!hasAccess) {
            return res.status(403).json({ 
                success: false, 
                message: `ACCESS DENIED: FORBIDDEN FORM THIS SECTOR` 
            });
        }

        next();
    };
}

export default authorizeRole;