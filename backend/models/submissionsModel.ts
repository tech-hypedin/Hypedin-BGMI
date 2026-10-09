import mongoose from 'mongoose';

interface ISubmission extends mongoose.Document {
    taskId: mongoose.Types.ObjectId,
    ambassadorId: mongoose.Types.ObjectId,
    proofUrls: string[],
    remarks?: string,
    status: 'Pending' | 'Approved' | 'Rejected',
    adminFeedback?: string,
    reviewedBy?: mongoose.Types.ObjectId,
    submissionPeriod: string
}

const submissionSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    ambassadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambassadors', required: true, index: true },
    proofUrls: {
        type: [
            {
                type: String,
                required: true,
                validate: {
                    validator: function(url: string) {
                        const urlRegex = /^https?:\/\/.+/;
                        return urlRegex.test(url);
                    },
                    message: 'Please provide valid proof image URLs.'
                }
            }
        ],
        validate: {
            validator: function(arr: string[]) {
                return arr && arr.length > 0;
            },
            message: 'At least one proof screenshot is required.'
        },
        required: true,
        unique: true
    },
    remarks: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', index: true },
    adminFeedback: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submissionPeriod: { type: String, required: true },
}, { timestamps: true });

// submissionSchema.index({ taskId: 1, ambassadorId: 1, submissionPeriod: 1 }, { unique: true });

const Submissions = mongoose.model<ISubmission>('Submission', submissionSchema);

export default Submissions;