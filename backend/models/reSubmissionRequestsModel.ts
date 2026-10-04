import mongoose, { BooleanSchemaDefinition } from "mongoose";

interface IReSubmissionRequest extends mongoose.Document {
    ambassadorId: mongoose.Types.ObjectId,
    taskId: mongoose.Types.ObjectId,
    reason: string,
    isRevertBack: boolean,
    isAccepted: boolean,
    isReSubmitted: boolean
}

const reSubmissionRequestSchema = new mongoose.Schema({
    ambassadorId: { type: mongoose.Schema.Types.ObjectId, ref: "Ambassadors", required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    reason: { type: String, required: true },
    isRevertBack: { type: Boolean, required: true, default: false },
    isAccepted: { type: Boolean, required: true, default: false },
    isReSubmitted: { type: Boolean, default: false }
},{ timestamps: true });

const ReSubmissionRequest = mongoose.model<IReSubmissionRequest>("ReSubmissionRequest", reSubmissionRequestSchema);

export default ReSubmissionRequest;