import cron from 'node-cron';
import Ambassadors from '../models/ambassadorModel.js';
import Tasks from '../models/tasksModel.js';

type Ranks = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Crown' | 'Ace' | 'Conqueror';

const ranks = {
    Bronze: 0,
    Silver: 1,
    Gold: 2,
    Platinum: 3,
    Diamond: 4,
    Crown: 5,
    Ace: 6,
    Conqueror: 7
} as const;

type RankKey = keyof typeof ranks;

// * NOTE: This will get re-enabled in season 3
// --- JOB 1: RP-Leaderboard Re-ranking ---
// const syncRPLeaderboard = async () => {
//     try {
//         console.log('[CRON] Starting Global Rank & Conqueror Sync...');
        
//         const operatives = await Ambassadors.find({}).sort({ RP: -1, XP: -1 });

//         const bulkOps = operatives.map((op, index) => {
//             const rankNumber = index + 1;

//             let assignedRank: RankKey = 'Bronze';
//             const rp = op.RP;
            
//             if (rp >= 8500) assignedRank = 'Ace';
//             else if (rp >= 6000) assignedRank = 'Crown';
//             else if (rp >= 4000) assignedRank = 'Diamond';
//             else if (rp >= 2500) assignedRank = 'Platinum';
//             else if (rp >= 1200) assignedRank = 'Gold';
//             else if (rp >= 500) assignedRank = 'Silver';

//             if (rankNumber <= 5) {
//                 assignedRank = 'Conqueror';
//             }

//             let maxRank: RankKey = (op.maxRank as RankKey) || assignedRank;

//             if (rankNumber <= 5) {
//                 maxRank = 'Conqueror'; 
//             } else {
//                 if (maxRank === 'Conqueror') {
//                     let temp: Ranks = 'Bronze';

//                     if (rp >= 8500) temp = 'Ace';
//                     else if (rp >= 6000) temp = 'Crown';
//                     else if (rp >= 4000) temp = 'Diamond';
//                     else if (rp >= 2500) temp = 'Platinum';
//                     else if (rp >= 1200) temp = 'Gold';
//                     else if (rp >= 500) temp = 'Silver';

//                     maxRank = temp;
//                 }

//                 const currentRankWeight = ranks[assignedRank];
//                 const maxRankWeight = ranks[maxRank] || 0;

//                 if (currentRankWeight > maxRankWeight) {
//                     maxRank = assignedRank;
//                 }
//             }

//             return {
//                 updateOne: {
//                     filter: { _id: op._id },
//                     update: { 
//                         $set: { 
//                             rpLeaderBoardRank: rankNumber,
//                             rank: assignedRank,
//                             maxRank: maxRank
//                         }
//                     }
//                 }
//             };
//         });

//         if (bulkOps.length > 0) {
//             await Ambassadors.bulkWrite(bulkOps);
//         }
        
//         console.log(`[CRON] Sync Complete: ${operatives.length} operatives updated. Top 5 promoted to Conqueror.`);
//     } catch (err) {
//         console.error('[CRON] Leaderboard Sync Failed:', err);
//     }
// }

// * NOTE: this cron job is only for updating the leaderboard rank and does not deal with the ranking logic for conquerer
// * this will stay enabled untill the end of season 2
const syncRPLeaderboard = async () => {
    try {
        console.log('[CRON] Starting Global Leaderboard Position Sync...');

        const operatives = await Ambassadors.find({}).sort({ RP: -1, XP: -1 }).select('_id');

        const bulkOps = operatives.map((op, index) => {
            const rankNumber = index + 1;

            return {
                updateOne: {
                    filter: { _id: op._id },
                    update: { 
                        $set: { 
                            rpLeaderBoardRank: rankNumber
                        }
                    }
                }
            };
        });

        if (bulkOps.length > 0) {
            await Ambassadors.bulkWrite(bulkOps);
        }
        
        console.log(`[CRON] Sync Complete: ${operatives.length} operatives updated with new leaderboard positions.`);
    } catch (err) {
        console.error('[CRON] Leaderboard Position Sync Failed:', err);
    }
}

// --- JOB 2: Mission Lifecycle Management ---
const syncMissionStatuses = async () => {
    try {
        console.log(`[CRON] Updating Mission Statuses...`);

        // Build a window for 'today': from 00:00:00.000 to 23:59:59.999
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        // Move 'Upcoming' → 'In Progress' only if startDate is TODAY
        const started = await Tasks.updateMany(
            { status: 'Upcoming', startDate: { $gte: startOfDay, $lte: endOfDay } },
            { $set: { status: 'In Progress' } }
        );

        // Move 'In Progress' → 'Completed' only if deadline is TODAY or earlier
        const ended = await Tasks.updateMany(
            { status: 'In Progress', deadline: { $gte: startOfDay, $lte: endOfDay } },
            { $set: { status: 'Completed' } }
        );

        console.log(
            `[CRON] Missions: ${started.modifiedCount} started, ${ended.modifiedCount} ended.`
        );
    } catch (error) {
        console.error('[CRON] Mission Sync Error:', error);
    }
}

// --- JOB 3: XP-Leaderboard Re-ranking ---
const syncXPLeaderboard = async () => {
    try {
        console.log('[CRON] Starting Global XP Leaderboard & Conqueror Sync...');
        
        // 1. Fetch all operatives sorted by highest XP first
        const operatives = await Ambassadors.find({}).sort({ XP: -1, RP: -1 });

        const bulkOps = operatives.map((op, index) => {
            const rankNumber = index + 1;

            return {
                updateOne: {
                    filter: { _id: op._id },
                    update: { 
                        $set: { 
                            xpLeaderBoardRank: rankNumber,
                        } 
                    }
                }
            };
        });

        // 2. Bulk update all documents
        if (bulkOps.length > 0) {
            await Ambassadors.bulkWrite(bulkOps);
        }
        
        console.log(`[CRON] XP Sync Complete: ${operatives.length} operatives updated.`);
    } catch (err) {
        console.error('[CRON] XP Leaderboard Sync Failed:', err);
    }
}

// const checkForMaxRP = async () => {
//     try {
//         const ambassadors = await Ambassadors.find({});

//         await Promise.all(ambassadors.map(async (ambassador) => {
//             let maxRp;
//             if (ambassador.RP > ambassador.season1RP) {
//                 maxRp = ambassador.RP;
//             } else {
//                 maxRp = ambassador.season1RP;
//             }

//             ambassador.maxRP = maxRp;
//             await ambassador.save();
//         }));
//     } catch(error) {
//         console.log("[CORN] Max RP Check failed");
//     }
// }

// --- INITIALIZATION ENGINE ---
export const initCronJobs = () => {
    console.log('--- CRON SYSTEM INITIALIZED ---');

    // Schedule both to run at Midnight every day
    cron.schedule('0 0 * * *', async () => {
        console.log('--- RUNNING MIDNIGHT MAINTENANCE ---');
        // console.log("--- CHECKING FOR MAX RP ---");
        await syncXPLeaderboard();
        await syncMissionStatuses();
        // await checkForMaxRP();
    });

    // Schedule the rp leaderboard to sync every hour
    cron.schedule(('*/30 * * * *'), async () => {
        console.log('--- RUNNING HALF-HOURLY LEADERBOARD SYNC ---');
        await syncRPLeaderboard();
    });

    // cron.schedule(('*/15 * * * *'), async () => {
    //     console.log("--- CHECKING FOR MAX RP ---");
    //     await checkForMaxRP();
    // });
}