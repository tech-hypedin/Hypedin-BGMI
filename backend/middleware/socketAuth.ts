import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { IncomingMessage } from 'http';

interface SocketRequest extends IncomingMessage {
    cookies?: Record<string, string>
}

interface CustomSocket extends Socket {
  userId?: string,
  request: SocketRequest
}

interface JwtPayload {
  userId: string;
}

const socketAuth = (socket: CustomSocket, next: (err?: Error) => void) => {
    const cookies = socket.request?.cookies;

    const token = cookies?.token;

    if (!token) {
        return next(new Error('Unauthorized: No token provided'));
    }

    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        console.error('FATAL: JWT_SECRET is not defined in environment variables.');
        return next(new Error('Internal Server Error'));
    }

    try {
        const payload = jwt.verify(token, secret) as JwtPayload;

        socket.userId = payload.userId;

        next();
    } catch (err) {
        console.error('Socket Auth Error:', err);
        next(new Error('Unauthorized: Invalid token'));
    }
};

export default socketAuth;