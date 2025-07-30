import mongoose, { Schema } from "mongoose";
import User from "./user.models.js";

const orderscema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: false, // Allow guest orders
        ref: 'User'
    },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, enum: ['delivery', 'collection'], required: true },
    address: { type: String },
    items: [{
        name: String,
        qty: Number,
        price: Number
    }],
    totalPrice: Number,
    paymentMethod: { type: String, enum: ['card', 'cash'], default: 'card' },
    status: { type: String, enum: ['new', 'preparing', 'ready', 'delivered', 'cancelled'], default: 'new' },
    createdAt: { type: Date, default: Date.now }
});

export const orders = mongoose.model("orders", orderscema);