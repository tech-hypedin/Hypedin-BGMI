import mongoose from 'mongoose';

interface IReward extends mongoose.Document {
    title: string,
    requiredRank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Crown' | 'Ace' | 'Ace Master' | 'Ace Dominator' | 'Conqueror',
    requiredRP: number,
    rewardType: 'Digital' | 'Merch' | 'Access' | 'Identity' | 'Hardware',
    isAutoUnlocked: boolean
}

const rewardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    requiredRank: { type: String, required: true, enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown', 'Ace', 'Ace Master', 'Ace Dominaator', 'Conqueror'] },
    requiredRP: { type: Number, default: 0 },
    rewardType: { type: String, enum: ['Digital', 'Merch', 'Access', 'Identity', 'Hardware'], default: 'Digital' },
    isAutoUnlocked: { type: Boolean, default: true }
}, { timestamps: true });

const Rewards = mongoose.model<IReward>('Reward', rewardSchema);

export default Rewards;