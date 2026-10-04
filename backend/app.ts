import 'dotenv/config';

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createAdapter } from '@socket.io/redis-adapter';
import ExpressMongoSanitize from 'express-mongo-sanitize';

import socketAuth from './middleware/socketAuth.js';
import connectDB from './database/connectDB.js';
import { initCronJobs } from './utils/initCronJobs.js';
import { initializeSheets } from './utils/sheetsTracker.js';
import redisClient, { connectRedis } from './database/redis.js';

import socketManager from './socket/socketManager.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import ambassadorRoutes from './routes/ambassadorRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import reSubmissionRouter from './routes/reSubmissionRoutes.js';
import nominationRoutes from './routes/nominationRoutes.js';

await connectRedis();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

if (process.env.NODE_ENV === 'development') {
    app.set('trust proxy', ['loopback', '127.0.0.1', '::1']);
} else {
    app.set('trust proxy', 1);
}

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "connect-src": ["'self'", process.env.FRONTEND_URL as string, "wss:"],
            "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
            "object-src": ["'none'"],
            "base-uri": ["'self'"],
            "frame-ancestors": ["'none'"],
            "upgrade-insecure-requests": []
        }
    }
}));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after some time',
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: 'hypedin_rl:',
    })
}));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    Object.defineProperty(req, 'query', {
        value: { ...req.query },
        writable: true,
        configurable: true,
        enumerable: true,
    });

    next();
});

app.use(ExpressMongoSanitize({
    allowDots: false,
    replaceWith: ''
}));

const subClient = redisClient.duplicate();
await subClient.connect();

io.adapter(createAdapter(redisClient, subClient));

io.engine.use(cookieParser());

io.use(socketAuth);

socketManager(io);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/ambassador', ambassadorRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reSubmissionRequest', reSubmissionRouter);
app.use('/api/nomination', nominationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[BACKEND ERROR]: ', err);

    res.status(500).json({ success: false, message: 'INTERNAL SERVER ERROR' });
});

const port: string | 3000 = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI as string);

        server.listen(port, () => {
            initializeSheets();

            const instanceId = process.env.NODE_APP_INSTANCE;
            const isPrimary = instanceId === '0' || instanceId === undefined;

            if(isPrimary) {
                import('./workers/applicationsWorker.js').then(() => (
                    console.log('[WORKER] Application Worker initialized.')
                ));
                initCronJobs();
            }

            server.timeout = 15000;

            console.log(`[BACKEND] Server is listening on port ${port}...`);
        });

        const gracefulShutdown = async (signal: string) => {
            console.log(`\n[BACKEND] ${signal} signal received. Closing active resources...`);
            server.close(async () => {
                try {
                    await redisClient.quit();
                    await subClient.quit();
                    console.log('[BACKEND] Connections safely terminated. Exiting cleanly.');
                    process.exit(0);
                } catch (err) {
                    console.error('[BACKEND] Error during shutdown cleanup:', err);
                    process.exit(1);
                }
            });
        }

        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();