import express from 'express';
import { orders } from '../models/order.model.js';
import User from '../models/user.models.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create new order (with optional authentication)
router.post('/create', async (req, res) => {
    try {
        let userId = null;
        
        // Check if there's a valid JWT token (from Authorization header or cookie)
        let token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            // Fallback to cookie-based token
            token = req.cookies?.authorization;
        }
        
        if (token) {
            try {
                const jwt = await import('jsonwebtoken');
                const decoded = jwt.default.verify(token, process.env.SECRETKEY);
                console.log('Token decoded successfully:', { userId: decoded.userId, email: decoded.Email });
                const user = await User.findById(decoded.userId);
                if (user) {
                    userId = user._id;
                    console.log('User found for order:', { userId: userId, userName: user.Name });
                }
            } catch (tokenError) {
                console.log('Token verification failed, proceeding as guest order:', tokenError.message);
            }
        } else {
            console.log('No token found, proceeding as guest order');
        }

        const {
            customerName,
            phone,
            type,
            address,
            items,
            totalPrice,
            paymentMethod
        } = req.body;

        // Validate required fields
        if (!customerName || !phone || !type || !items || !totalPrice) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate delivery address for delivery orders
        if (type === 'delivery' && !address) {
            return res.status(400).json({
                success: false,
                message: 'Delivery address is required for delivery orders'
            });
        }

        // Create new order
        const newOrder = new orders({
            userId: userId,
            customerName,
            phone,
            type,
            address: type === 'delivery' ? address : 'Collection',
            items,
            totalPrice: parseFloat(totalPrice),
            status: 'new',
            paymentMethod: paymentMethod || 'card'
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: savedOrder
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get all orders (for admin)
router.get('/all', async (req, res) => {
    try {
        const allOrders = await orders.find()
            .populate('userId', 'Name Email PhoneNumber')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: allOrders
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get orders by user ID
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const userOrders = await orders.find({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: userOrders
        });

    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Update order status
router.patch('/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['new', 'preparing', 'ready', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const updatedOrder = await orders.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: updatedOrder
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await orders.findById(orderId)
            .populate('userId', 'Name Email PhoneNumber');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

export default router;
