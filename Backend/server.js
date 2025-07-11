//import 
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// For ES Modules, __dirname isn't defined by default, so create it:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__filename)

// creating instance of objects 
const express_api=express();
dotenv.config();


//database server 
const URI= process.env.URI;
const PORT=process.env.PORT;
console.log(PORT,URI)

mongoose.connect(URI)
.then(()=>{console.log("CONNECTED SUCCESSFULLY !!")})
.catch((err)=>{console.error("CONNECTION FAILED ",err)});


//sending static file for frontend 
express_api.use(express.static(path.resolve(__filename,"../FRONTEND/vite-project/dist")));
 





//server start 

express_api.listen(PORT,()=>{
    console.log(`running on port : ${PORT}`)
})