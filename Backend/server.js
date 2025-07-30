//import 
import express from 'express';
import dotenv from 'dotenv';
//import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//import xss from 'xss-clean';
//import ExpressMongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import userRouter from './routes/userRoute.js';
import orderRouter from './routes/orderRoute.js';
import itemRouter from './routes/itemRoute.js';
import adminRouter from './routes/adminRoute.js';
import { seedFirstAdmin } from './data/admin.seed.js';







// creating instance of objects 
const express_api=express();
dotenv.config();
const PORT=process.env.PORT || 5000;

// MIDDLEWARES FOR BASIC SETUP 
//express_api.use(helmet())// to set default header 
//express_api.use(xss()); // to help reduce cross site scripting 
//express_api.use(ExpressMongoSanitize())// for mongo sanitizations 

//cors 
express_api.use(cors({
    origin: 'http://localhost:3001',
  credentials: true
}))
// parsing 
express_api.use(express.json());
express_api.use(cookieParser());

//routes 
express_api.use('/api/User',userRouter);
express_api.use('/api/Order',orderRouter);
express_api.use('/api/items',itemRouter);
express_api.use('/api/admin',adminRouter);

//database connector 
mongoose.connect(process.env.URI)
.then(async ()=>{
    console.log("CONNECTED TO DB");
    // Seed first admin if none exists
    await seedFirstAdmin();
})
.catch((err)=>{console.error(err)});
//server start 

express_api.listen(PORT,()=>{
    console.log(`running on port : ${PORT}`)
})