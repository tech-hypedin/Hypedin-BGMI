import mongoose from 'mongoose';

interface IGroups extends mongoose.Document {
    name: string,
    groupType: string,
    members: mongoose.Types.ObjectId[]
}

const groupSchema = new mongoose.Schema({
    name: { type: String, default: 'GLOBAL OPERATIVES' },
    groupType: { type: String, default: 'global', unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
}, { timestamps: true });

groupSchema.statics.joinGroup = async function (userId: string) {
    try {
        await this.findOneAndUpdate(
            { groupType: 'global' },
            { $addToSet: { members: userId } },
            { upsert: true, new: true }
        );
    } catch (err) {
        console.error('TACTICAL ERROR: Failed to join global group', err);
    }
};

const Groups = mongoose.model<IGroups>('Group', groupSchema);

export default Groups;