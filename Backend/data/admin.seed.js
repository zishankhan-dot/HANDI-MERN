import User from '../models/user.models.js';
import dotenv from 'dotenv';
dotenv.config();

// Function to seed the first admin from environment variables
export const seedFirstAdmin = async () => {
    try {
        const adminEmail = process.env.FIRST_ADMIN_EMAIL;
        const adminPassword = process.env.FIRST_ADMIN_PASSWORD;
        const adminName = process.env.FIRST_ADMIN_NAME;
        const adminPhone = process.env.FIRST_ADMIN_PHONE;

        // Check if admin credentials exist in .env
        if (!adminEmail || !adminPassword || !adminName || !adminPhone) {
            console.log('No first admin credentials found in .env file');
            return null;
        }

        // Check if any admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin already exists in database');
            return null;
        }

        // Create first admin
        const firstAdmin = new User({
            Name: adminName,
            Email: adminEmail,
            PhoneNumber: adminPhone,
            Password: adminPassword,
            role: 'admin',
            isphoneVerified: true
        });

        await firstAdmin.save();
        console.log('First admin created successfully from .env');
        return firstAdmin;
    } catch (error) {
        console.error('Error seeding first admin:', error);
        return null;
    }
};
