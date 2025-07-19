import { NewUser,VerifyOtp,loginUser } from "../middleware/user.controller.js";

import express, { Router } from 'express';

const userRouter=express.Router();
//register 
userRouter.post('/newUser',NewUser);
//otp verification
userRouter.post("/verifyotp",VerifyOtp)
//login
userRouter.post("/login",loginUser);


export default userRouter;
