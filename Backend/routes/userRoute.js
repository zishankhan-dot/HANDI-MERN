import { NewUser,VerifyOtp,loginUser,RegenerateOtp } from "../middleware/user.controller.js";

import express, { Router } from 'express';

const userRouter=express.Router();
//register 
userRouter.post('/newUser',NewUser);
//otp verification
userRouter.post("/verifyotp",VerifyOtp)
//regenerate otp
userRouter.post("/regenerateOtp",RegenerateOtp);
//login
userRouter.post("/login",loginUser);


export default userRouter;
