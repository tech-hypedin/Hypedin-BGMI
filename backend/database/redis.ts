import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => {
    console.error('[BACKEND] Redis Client Error', err);
    process.exit(1);
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('[BACKEND] Redis Connected: High-Speed Layer Active');
    }
};

export default redisClient;