import { Job, Worker } from 'bullmq';

import redisClient from '../database/redis.js';
import Applications from '../models/applicationsModel.js';
import { appendToGoogleSheets } from '../utils/sheetsTracker.js';

interface ApplicationData {
    experienceDetails: string,
    name: string,
    course: string,
    college: string,
    convert: string,
    tournamentExp: boolean,
    playedBefore: boolean,
    state: string,
    city: string,
    instagramUrl: string,
    phoneNo: number,
    email: string,
    hasTime: boolean,
    hasExperience: boolean,
    reasoning: string,
    currentYear: '1st Year' | '2nd Year' | '3rd Year',
    status?: 'Pending Review' | 'Rejected' | 'Accepted',
    accountRank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Crown' | 'Ace' | 'Ace Master' | 'Ace Dominator' | 'Conqueror'
}

const redisConnection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined
}

const sanitizeValue = (val: any): string => {
    if (Array.isArray(val)) return val.join('; ');

    if (val === null || val === undefined) return '';

    if (typeof val === 'object') return JSON.stringify(val);

    return String(val);
}

const worker = new Worker('applications', async (job: Job<ApplicationData>) => {
    const data = job.data;

    const newApplication = new Applications(data);
    await newApplication.save();

    const sheetData = [[
        sanitizeValue(new Date().toLocaleString()),
        sanitizeValue(data.name),
        sanitizeValue(data.email),
        sanitizeValue(data.phoneNo),
        sanitizeValue(data.state),
        sanitizeValue(data.city),
        sanitizeValue(data.college),
        sanitizeValue(data.course),
        sanitizeValue(data.currentYear),
        sanitizeValue(data.instagramUrl),
        sanitizeValue(data.playedBefore),
        sanitizeValue(data.accountRank),
        sanitizeValue(data.hasExperience ? 'Yes' : 'No'),
        sanitizeValue(data.experienceDetails),
        sanitizeValue(data.tournamentExp ? 'Yes' : 'No'),
        sanitizeValue(data.convert ? 'Yes' : 'No'),
        sanitizeValue(data.hasTime ? 'Yes' : 'No'),
        sanitizeValue(data.reasoning),
        sanitizeValue(data.status)
    ]];

    await appendToGoogleSheets(process.env.GOOGLE_SHEETS_ID!, 'Sheet1!A1', sheetData);

    await redisClient.del('cache: applications');
}, { connection: redisConnection, concurrency: 5 });

worker.on('completed', (job) => {
    console.log(`[WORKER] Job ${job.id} completed - phoneNo: ${job.data.phoneNo}`);
});

worker.on('failed', (job, err) => {
    console.error(`[WORKER] Job ${job?.id} permanently failed after all retry attempts:`, err);
});

process.on('SIGTERM', async () => { await worker.close(); });
process.on('SIGINT',  async () => { await worker.close(); });

export default worker;