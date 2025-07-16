import { NewUser,loginUser } from "../middleware/user.controller.js";

import express, { Router } from 'express';

const userRouter=express.Router();
//register 
userRouter.post('/api/newUser',NewUser);
//otp verification
//userRouter.post("/api/verifyotp",VerifyOtp)
//login
userRouter.post("/api/login",loginUser);


export default userRouter;
