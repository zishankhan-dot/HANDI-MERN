//import 
import express from 'express';
import dotenv from 'dotenv';
//import helmet from 'helmet';
import cors from 'cors';
//import xss from 'xss-clean';
//import ExpressMongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import userRouter from './routes/userRoute.js';







// creating instance of objects 
const express_api=express();
dotenv.config();
const PORT=process.env.PORT;

// MIDDLEWARES FOR BASIC SETUP 
//express_api.use(helmet())// to set default header 
//express_api.use(xss()); // to help reduce cross site scripting 
//express_api.use(ExpressMongoSanitize())// for mongo sanitizations 

//cors 
express_api.use(cors({
    origin: 'http://localhost:3000',
  credentials: true
}))
// parsing 
express_api.use(express.json());

//routes 
express_api.use('/api/User',userRouter);
//express_api.use("/Order",)

//database connector 
mongoose.connect(process.env.URI)
.then(()=>{console.log("CONNECTED TO DB")})
.catch((err)=>{console.error(err)});
//server start 

express_api.listen(PORT,()=>{
    console.log(`running on port : ${PORT}`)
})