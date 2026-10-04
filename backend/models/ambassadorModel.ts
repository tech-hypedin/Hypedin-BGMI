import mongoose from 'mongoose';

interface IAmbassador extends mongoose.Document {
    UID: string,
    IGN: string,
    ambassadorId: mongoose.Types.ObjectId,
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Crown' | 'Ace' | 'Conqueror',
    RP: number,
    XP: number,
    collegeName: string,
    rpLeaderBoardRank?: number,
    xpLeaderBoardRank?: number,
    stats: { missionsCompleted: number, totalRewards: number, totalMissions: number },
    social: { platform: 'Youtube' | 'Rooter' | 'Instagram' | 'Discord', platformUrl: string },
    avator?: string,
    maxRank: string,
    maxRP: number,
    maxXP: number,
    season1RP: number,
    season2RP: number,
    season3RP: number,
    season1XP: number,
    season2XP: number,
    season3XP: number,
    xpForSpecificTask: number
}

const ambassadorSchema = new mongoose.Schema({
    UID: { type: String, unique: true, sparse: true },
    IGN: { type: String },
    ambassadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rank: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown', 'Ace', 'Conqueror'], default: 'Bronze' },
    RP: { type: Number, default: 0, index: true },
    XP: { type: Number, default: 0, index: true },
    collegeName: { type: String, required: true },
    rpLeaderBoardRank: { type: Number, default: undefined },
    xpLeaderBoardRank: { type: Number, default: undefined },
    stats: { missionsCompleted: { type: Number, default: 0 }, totalRewards: { type: Number, default: 0 }, totalMissions: { type: Number, default: 0 } },
    social: { platform: { type: String, enum: ['Youtube', 'Rooter', 'Instagram', 'Discord'] }, platformUrl: { type: String } },
    avator: { type: String, enum: ["avator_1","avator_2","avator_3","avator_4"] },
    maxRank: { type: String, default: 'Bronze' },
    maxRP: { type: Number, default: function(this: any): number { return this.RP || 0 } },
    maxXP: { type: Number, default: function(this: any): number { return this.XP || 0 } },
    season1RP: { type: Number, default: 0 },
    season2RP: { type: Number, default: 0 },
    season3RP: { type: Number, default: 0 },
    season1XP: { type: Number, default: 0 },
    season2XP: { type: Number, default: 0 },
    season3XP: { type: Number, default: 0 },
    xpForSpecificTask: { type: Number, default: 0 }
}, { timestamps: true });

ambassadorSchema.pre('save', function() {
    const rp = this.RP;
    if (rp >= 8500) this.rank = 'Ace';
    else if (rp >= 6000) this.rank = 'Crown';
    else if (rp >= 4000) this.rank = 'Diamond';
    else if (rp >= 2500) this.rank = 'Platinum';
    else if (rp >= 1200) this.rank = 'Gold';
    else if (rp >= 500) this.rank = 'Silver';
    else this.rank = 'Bronze';

    return;
});

ambassadorSchema.pre('save', function() {
    const ranks = {
        Bronze: 0,
        Silver: 500,
        Gold: 1200,
        Platinum: 2500,
        Diamond: 4000,
        Crown: 6000,
        Ace: 8500,
        Conqueror: 15000
    }

    if (this.isModified('rank')) {
        let maxRank = ranks[this.maxRank as keyof typeof ranks];

        if(ranks[this.rank as keyof typeof ranks] > maxRank) {
            this.maxRank = this.rank;
        }
    }
});

ambassadorSchema.pre('save', function() {
    if(this.isModified('RP')) {
        this.maxRP = Math.max(this.maxRP, this.RP);
    }

    if(this.isModified('XP')) {
        this.maxXP = Math.max(this.maxXP, this.XP);
    }
});

ambassadorSchema.index({ RP: -1 });

const Ambassadors = mongoose.model<IAmbassador>('Ambassadors', ambassadorSchema);

export default Ambassadors;