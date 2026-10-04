import 'dotenv/config';

import mongoose from 'mongoose';

import Ambassadors from './models/ambassadorModel.js';

const deductAmbassadorsRp = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if(!mongoUri) {
            throw new Error('Mongo URI not defined, check .env');
        }

        console.log(`Attempting to connect to: ${mongoUri.split('@')[1] || 'Localhost'}`);

        await mongoose.connect(mongoUri);
        console.log('[SCRIPT LOG] Connected to the mongoose database');

        console.log('[SCRIPT LOG] Fetching all ambassadors from mongoose');
        const operatives = await Ambassadors.find();

        const bulkOps = operatives.map((op, index) => {
            // * check the ambassadors current RP and XP
            const currentRP = op.RP || 0;
            const currentXP = op.XP || 0;

            // * compute the rp amount to be deducted
            const rpMinus = op.RP * 15 /100;
            const newRp = Math.max(0, Math.round(currentRP - rpMinus));

            const newRank = '';

            if (newRp >= 8500) newRank = 'Ace';
            else if (newRp >= 6000) newRank = 'Crown';
            else if (newRp >= 4000) newRank = 'Diamond';
            else if (newRp >= 2500) newRank = 'Platinum';
            else if (newRp >= 1200) newRank = 'Gold';
            else if (newRp >= 500) newRank = 'Silver';
            else newRank = 'Bronze';

            // * return the new updated RP
            // NOTE:: need to change the value season1RP to season2RP or season3RP respectively before every RP deduction cycle
            return {
                updateOne: {
                    filter: { _id: op._id },
                    update: {
                        $set: {
                            maxRP: currentRP,
                            maxXP: currentXP,
                            season2RP: currentRP,
                            RP: newRp,
                            season2XP: currentXP,
                            XP: 0,
                            rank: newRank
                        }
                    }
                }
            }
        });

        if(bulkOps.length > 0) {
            await Ambassadors.bulkWrite(bulkOps);
        }

        console.log('[SCRIPT LOG] Finished ambassador RP deduction');
    } catch (err) {
        console.error('[SCRIPT ERROR] error in deducting ambassadors RP: ', err);
        
        process.exit(1);
    } finally {
        await mongoose.disconnect();

        console.log('[SCRIPT LOG] Disconnected from the database');
    }
}

deductAmbassadorsRp();