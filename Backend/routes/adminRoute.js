import express from 'express';
import User from '../models/user.models.js';
import { verifyAdminAccess } from '../middleware/auth.middleware.js';
import { seedFirstAdmin } from '../data/admin.seed.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const PEPPER = process.env.PEPPER;

// Obscure endpoint for admin login - hard to guess
router.post('/auth-9x7k2m-secure-portal', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find admin user
        const admin = await User.findOne({ Email: email, role: 'admin' });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(PEPPER + password.trim(), admin.Password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            admin: {
                id: admin._id,
                name: admin.Name,
                email: admin.Email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// Obscure endpoint for admin registration - hard to guess
router.post('/create-admin-b8n4p1-restricted', async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Check if this is the first admin creation (from .env)
        const existingAdmins = await User.countDocuments({ role: 'admin' });
        
        if (existingAdmins === 0) {
            // Try to seed first admin from .env
            const seededAdmin = await seedFirstAdmin();
            if (seededAdmin) {
                return res.json({
                    success: true,
                    message: 'First admin created from environment variables',
                    admin: {
                        id: seededAdmin._id,
                        name: seededAdmin.Name,
                        email: seededAdmin.Email,
                        role: seededAdmin.role
                    }
                });
            }
        }

        // For subsequent admin creation, require JWT verification
        if (existingAdmins > 0) {
            // Check for JWT token
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. Admin token required for creating new admins.'
                });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const requestingAdmin = await User.findById(decoded.userId);
                
                if (!requestingAdmin || requestingAdmin.role !== 'admin') {
                    return res.status(403).json({
                        success: false,
                        message: 'Only existing admins can create new admins.'
                    });
                }
            } catch (jwtError) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid admin token.'
                });
            }
        }

        // Validate required fields
        if (!name || !email || !phoneNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ Email: email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Admin with this email already exists'
            });
        }

        // Create new admin
        const newAdmin = new User({
            Name: name,
            Email: email,
            PhoneNumber: phoneNumber,
            Password: password,
            role: 'admin',
            isphoneVerified: true
        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                id: newAdmin._id,
                name: newAdmin.Name,
                email: newAdmin.Email,
                role: newAdmin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating admin',
            error: error.message
        });
    }
});

// Get all admins - protected route
router.get('/list-admins-k3m9x7', verifyAdminAccess, async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-Password -Otp');
        res.json({
            success: true,
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching admins',
            error: error.message
        });
    }
});

// Delete admin - protected route
router.delete('/remove-admin-q7w2e9/:adminId', verifyAdminAccess, async (req, res) => {
    try {
        const { adminId } = req.params;
        
        // Prevent admin from deleting themselves
        if (adminId === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own admin account'
            });
        }

        // Check if this is the last admin
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete the last admin account'
            });
        }

        const deletedAdmin = await User.findByIdAndDelete(adminId);
        if (!deletedAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.json({
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting admin',
            error: error.message
        });
    }
});

export default router;
