import mongoose from 'mongoose';

const connectDB = async (url: string) => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('[BACKEND] MongoDB connection established');
        });

        return await mongoose.connect(url, {
            maxPoolSize: 50,
            minPoolSize: 10,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000
        });
    } catch (err) {
        console.error('[BACKEND] Database connection error:', err);
        process.exit(1);
    }
}

export default connectDB;