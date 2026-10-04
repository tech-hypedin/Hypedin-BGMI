import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/userModels.js';
import Groups from './models/groupModel.js';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Look for .env in the current dir OR one level up (root)
dotenv.config(); 
dotenv.config({ path: path.join(__dirname, '../.env') });

const scaffoldUsers = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined. Check your .env file or Docker environment variables.');
        }

        console.log(`Attempting to connect to: ${mongoUri.split('@')[1] || 'Localhost'}`); // Log safely
        
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to database for scaffolding...');

        // 1. Clean up target test users to avoid "Duplicate Key" errors
        const targetEmails = ['rohit@hypedin.co', 'manav@hypedin.co'];
        await User.deleteMany({ email: { $in: targetEmails } });
        console.log('Cleaning up existing test accounts...');

        await Groups.deleteMany({ groupType: 'global' });

        const groups = await Groups.create([
            {
                name: 'Global Operatives',
                groupType: 'global',
                members: []
            }
        ]);

        console.log('✅ Success: Created global group');
        console.table(groups.map((u) => ({ name: u.name, type: u.groupType, members: u.members })));

        // 2. Create the Admin user
        const users = await User.create([
            {
                UID: 'ADMIN_ROHIT',
                IGN: 'Rohit',
                phoneNo: '8368033154',
                email: 'rohit@hypedin.co',
                password: 'REDBULL#1234',
                role: 'Admin'
            },
            {
                UID: 'ADMIN_MANAV',
                IGN: 'Manav',
                phoneNo: '8368033154',
                email: 'manav@hypedin.co',
                password: 'hypedine37',
                role: 'Admin'
            },
            {
                UID: 'ADMIN_PRATEEK',
                IGN: 'Prateek',
                phoneNo: '8368033154',
                email: 'prateek@krafton.com',
                password: 'prateek@krafton/!@#4',
                role: 'Admin'
            }
        ]);

        console.log('✅ Success: Created Admin user');
        console.table(users.map((u) => ({ id: u._id, email: u.email, role: u.role })));
        
        await mongoose.connection.close();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error scaffolding users:', error);
        process.exit(1);
    }
};

// Execute immediately if run as a script
scaffoldUsers();

export default scaffoldUsers;
