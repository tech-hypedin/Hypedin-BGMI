import mongoose from 'mongoose';

interface ITask extends mongoose.Document {
    phase: number,
    title: string,
    description: string,
    rpReward: number,
    subGuide: string,
    category: 'Social Media' | 'Campus' | 'Content' | 'Referral',
    status: 'Upcoming' | 'In Progress' | 'In Review' | 'Completed',
    isImageAllowed: boolean,
    taskType: 'Daily' | 'Weekly' | 'Monthly' | 'One-Time',
    rewards: string,
    startDate?: Date,
    deadline?: Date,
    createdBy: mongoose.Types.ObjectId
}

const taskSchema = new mongoose.Schema({
    phase: { type: Number, required: true, enum: [1,2,3] },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    rpReward: { type: Number, required: true, min: 0 },
    subGuide: { type: String, required: true },
    category: { type: String, enum: ['Social Media', 'Campus', 'Content', 'Referral'], default: 'Social Media' },
    status: { type: String, enum: ['Upcoming', 'In Progress', 'In Review', 'Completed'], default: 'Upcoming' },
    taskType: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'One-Time'], default: 'One-Time' },
    isImageAllowed: { type: Boolean, required: true, default: false },
    rewards: { type: String, required: true, default: "" },
    startDate: { type: Date, default: Date.now },
    deadline: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

taskSchema.virtual('computedStatus').get(function() {
    const now = new Date();
    
    if (this.startDate > now) return 'Upcoming';
    if (this.deadline && now > this.deadline) return 'Completed'; 
    return 'In Progress';
});

taskSchema.index({ startDate: 1 });

const Tasks = mongoose.model<ITask>('Task', taskSchema);

export default Tasks;