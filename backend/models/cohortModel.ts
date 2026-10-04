import mongoose from 'mongoose';

interface ICohort extends mongoose.Document {
    mvp_id: mongoose.Types.ObjectId,
    name: string,
    email: string,
    phoneNo: string,
    UID: string,
    MVPUID: string,
    idCardImage: string[],
    cohort: 'Cohort-1',
    signupSeason: 'Season-1' | 'Season-2' | 'Season-3'
}

const cohortSchema = new mongoose.Schema({
    mvp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambassadors', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true, unique: true },
    UID: { type: String, required: true, unique: true },
    MVPUID: { type: String, required: true },
    idCardImage: [{ type: String, required: true }],
    cohort: { type: String, required: true, enum: ['Cohort-1'] },
    signupSeason: { type: String, required: true, enum: ['Season-1', 'Season-2', 'Season-3'], default: 'Season-1' }
});

const Cohort = mongoose.model<ICohort>('Cohorts', cohortSchema);

export default Cohort;