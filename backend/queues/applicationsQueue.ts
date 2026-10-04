import { Queue } from 'bullmq';

const redisConnection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined
}

const applicationQueue = new Queue('applications', {
    connection : redisConnection,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 5000
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 }
    }
});

export { applicationQueue }