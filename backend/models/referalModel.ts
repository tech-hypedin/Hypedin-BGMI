import mongoose from "mongoose";

interface IReferal extends mongoose.Document {
    name: string,
    email: string,
    phoneNo: number,
    college: string,
    course: string,
    currentYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year',
    instagramUrl: string,
    accountRank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Crown' | 'Ace' | 'Ace Master' | 'Ace Dominator' | 'Conqueror',
    hasTime: boolean,
    tournamentExp: boolean,
    hasExperience: boolean,
    convert: string,
    reasoning: string,
    experienceDetails: string,
    MVPID: mongoose.Types.ObjectId,
    status?: 'Pending Review' | 'Rejected' | 'Accepted',
}

const referalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: Number, required: true, unique: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    currentYear: { type: String, enum: ['1st Year','2nd Year','3rd Year','4th Year'], required: true },
    accountRank: { type: String, enum: ['Bronze','Silver','Gold','Platinum','Diamond','Crown','Ace','Ace Master','Ace Dominator','Conqueror'], required: true },
    instagramUrl: { type: String, required: true, unique: true },
    tournamentExp: { type: Boolean, required: true },
    hasTime: { type: Boolean, required: true },
    convert: { type: String, required: true },
    reasoning: { type: String, required: true },
    hasExperience: { type: Boolean, required: true, default: false },
    MVPID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending Review','Rejected','Accepted'], default: 'Pending Review' },
},{ timestamps: true });

const Referals = mongoose.model<IReferal>('Referals', referalSchema);

export default Referals;