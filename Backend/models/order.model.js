import mongoose, { Schema } from "mongoose";

import {User} from "./user.models";



const orderscema= new Schema({
userId:{type:Schema.Types.ObjectId,
        required:true,
        ref: User
    },
customerName: { type: String, required: true },
  phone:        { type: String, required: true },
  type:         { type: String, enum: ['delivery','collection'], required: true },
  address:      { type: String },
  items: [{
    name:  String,
    qty:   Number,
    price: Number
  }],
  totalPrice: Number,
  status:     { type: String, default: 'new' },
  createdAt:  { type: Date, default: Date.now }
});


export const orders=mongoose.model("orders",orderscema);