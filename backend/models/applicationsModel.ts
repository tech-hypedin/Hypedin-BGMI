import mongoose from 'mongoose';

interface IApplication extends mongoose.Document {
    experienceDetails: string,
    playedBefore: boolean,
    name: string,
    course: string,
    college: string,
    convert: string,
    state: string,
    city: string,
    instagramUrl: string,
    tournamentExp: boolean,
    phoneNo: number,
    email: string,
    hasTime: boolean,
    hasExperience: boolean,
    reasoning: string,
    currentYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year',
    status?: 'Pending Review' | 'Rejected' | 'Accepted' | 'Back Out',
    accountRank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Crown' | 'Ace' | 'Ace Master' | 'Ace Dominator' | 'Conqueror' | 'NA'
}

const applicationSchema = new mongoose.Schema({
    experienceDetails: { type: String },
    playedBefore: { type: Boolean },
    name: { type: String, required: true },
    course: { type: String, required: true },
    college: { type: String, required: true },
    convert: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    instagramUrl: { type: String, required: true },
    reasoning: { type: String, required: true },
    phoneNo: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    hasTime: { type: Boolean, default: false, required: true },
    tournamentExp: { type: Boolean, required: true, default: false },
    hasExperience: { type: Boolean, required: true, default: false },
    currentYear: { type: String, enum: [ '1st Year', '2nd Year', '3rd Year', '4th Year' ] },
    status: { type: String, enum: ['Pending Review', 'Rejected', 'Accepted', 'Back Out'], default: 'Pending Review' },
    accountRank: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown', 'Ace', 'Ace Master', 'Ace Dominator', 'Conqueror', 'NA'], default: 'Bronze' }
});

const Applications = mongoose.model<IApplication>('Applications', applicationSchema);

export default Applications;