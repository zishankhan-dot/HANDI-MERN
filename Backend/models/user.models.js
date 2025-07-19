import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';

const PEPPER= process.env.PEPPER;
const id=Schema.Types.ObjectId;

const userSchema=new Schema({
    UserId:id,
    Name:{type:String,Required:true},
    Email:{type: String,required: true, unique: true,match:/\.com$/},  
    PhoneNumber:{type:String,required:true},
    Password:{type: String,required: true},
    isphoneVerified:{type:Boolean,default:"false"},
    Otp:{type:String},
    otp_expires:{type:Date},
    createdAt:{type: Date,default:Date.now,immutable:true},
});



//encrypting before saving password .. 
userSchema.pre('save',async function(next){
    this.Password=await bcrypt.hash(PEPPER+this.Password,10)
    this.ConfirmPassword=await bcrypt.hash(PEPPER+this.Password,10)
    next();
})

const User=mongoose.model("User",userSchema);

//export userModel ..
export default User;


