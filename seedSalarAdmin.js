import path from 'path';
import { fileURLToPath } from 'url';
import dbConnect from './utils/dbConnect.js';
import User from './models/User.js';
import Counter from './models/Counter.js';
import { hashPassword } from './utils/hashPassword.js';
import { generateToken, generateRefreshToken } from './utils/jwt.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from absolute path to avoid cwd issues
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function seedSalarAdmin() {
    try {
        // Connect to database
        await dbConnect();
        console.log('✅ Connected to database');

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: 'salarsafayi@gmail.com' },
                { username: 'salarsafayi@gmail.com' }
            ]
        });

        if (existingUser) {
            console.log('⚠️  User already exists:', existingUser.email);
            console.log('📝 Updating password to: admin123');

            // Update password
            const hashedPassword = await hashPassword('admin123');
            existingUser.password = hashedPassword;
            existingUser.status = 'active';
            existingUser.role = 'admin';
            await existingUser.save();

            console.log('✅ User updated successfully!');
            console.log('👤 Username:', existingUser.username);
            console.log('📧 Email:', existingUser.email);
            console.log('🔑 Password: admin123');
            console.log('👑 Role:', existingUser.role);
            console.log('✅ Status:', existingUser.status);

            process.exit(0);
        }

        // Create new admin user
        const adminData = {
            firstName: 'Salar',
            lastName: 'Safayi',
            nationalId: '0000000000',
            username: 'salarsafayi@gmail.com',
            email: 'salarsafayi@gmail.com',
            mobile: '09123456789',
            role: 'admin',
            status: 'active',
        };

        // Hash password
        const hashedPassword = await hashPassword('admin123');
        adminData.password = hashedPassword;

        // Generate ID using Counter
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        adminData.Id = counter.seq;

        // Generate tokens
        const token = generateToken('user');
        const refreshToken = generateRefreshToken('user');
        adminData.token = token;
        adminData.refreshToken = refreshToken;

        // Create admin user
        const admin = new User(adminData);
        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('👤 Username:', adminData.username);
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Password: admin123');
        console.log('👑 Role:', adminData.role);
        console.log('✅ Status:', adminData.status);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
}

seedSalarAdmin();
