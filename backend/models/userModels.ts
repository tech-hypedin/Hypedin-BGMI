import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import './groupModel.js';
import './messagesModel.js';

interface IUser extends mongoose.Document {
    UID: string,
    IGN: string,
    email: string,
    password: string,
    role: 'Admin' | 'Ambassador' | 'Manager',
    mustChangePassword: boolean,
    comparePassword(candidatePassword: string): Promise<boolean>,
    createJWT(): Promise<string>
}

const userSchema = new mongoose.Schema({
    UID: { type: String, unique: true, sparse: true },
    IGN: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['Admin', 'Ambassador', 'Manager'], required: true },
    mustChangePassword: { type: Boolean, default: true }
});

userSchema.pre('save', async function() {
    if (this.isNew) {
        (this as any)._wasNew = true;
    }

    if(!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return;
    } catch (err) {
        throw new Error('Error in hashing password')
    }
});

userSchema.post('save', async function (doc, next) {
    if((this as any)._wasNew) {
        try {
            const Message = mongoose.models.Messages || mongoose.model('Messages');
            const Group = mongoose.models.Group || mongoose.model('Group');

            const session = (this as any).$__.options?.session || null;

            const globalGroup = await Group.findOneAndUpdate(
                { groupType: 'global' },
                { 
                    $setOnInsert: { name: 'Global Operatives' },
                    $addToSet: { members: doc._id } 
                },
                { upsert: true, new: true, session }
            );

            await Message.create([{
                senderId: doc._id,
                message: `A NEW OPERATIVE HAS JOINED THE SQUAD.`,
                isSystemMessage: true,
                timestamp: new Date(),
                onModel: 'Group',
                receiverId: globalGroup._id
            }], { session });

            console.log(`[PROVISIONING] User ${doc._id} enrolled in global group.`);
        } catch (err) {
            console.error('[CRITICAL] Enrollment failed:', err);
            return next(err as any);
        }
    }
});

userSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const Message = mongoose.models.Messages || mongoose.model('Messages');
        await Message.deleteMany({
            $or: [
                { senderId: doc._id },
                { receiverId: doc._id }
            ]
        });
        console.log(`Cleanup: All messages for User ${doc._id} purged.`);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.createJWT = async function () {
    return jwt.sign({ userId: this._id, role: this.role }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_LIFETIME as any });
}

const User = mongoose.model<IUser>('User', userSchema);

export default User;
