import mongoose from 'mongoose';

interface IMessages extends mongoose.Document {
    senderId: mongoose.Types.ObjectId,
    receiverId: mongoose.Types.ObjectId,
    message: string,
    onModel: 'User' | 'Group'
}

const messagesSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel', required: true },
    message: { type: String },
    onModel: { type: String, required: true, enum: ['User', 'Group'] }
}, { timestamps: true });

messagesSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messagesSchema.index({ receiverId: 1, createdAt: -1 });

const Messages = mongoose.model<IMessages>('Messages', messagesSchema);

export default Messages;