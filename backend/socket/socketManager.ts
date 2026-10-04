import Groups from '../models/groupModel.js';
import { Server, Socket } from 'socket.io';

interface CustomSocket extends Socket {
    userId?: string;
}

const socketManager = (io: Server) => {
    io.on('connection', async (socket: CustomSocket) => {
        const userId = socket.userId;

        if (!userId) {
            console.error('[SOCKET] Connection rejected: Missing UserID');
            return socket.disconnect();
        }

        try {
            const groups = await Groups.find({ groupType: 'global' });

            groups.forEach((g) => {
                const groupId = g._id.toString();
                socket.join(groupId);
                console.log(`[JOIN] User ${userId} joined group: ${groupId}`);
            });

            socket.join(userId.toString());
        } catch (err) {
            console.error('[SOCKET ERROR] Failed to fetch groups:', err);
        }

        console.log(`[SOCKET CONNECT] New user ${userId} connected`)

        socket.on('disconnect', async () => {
            console.log('[SOCKET DISCONNECT] User disconnected', userId);
        });
    });
};

export default socketManager;