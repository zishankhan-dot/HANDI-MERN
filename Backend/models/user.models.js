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
    ConfirmPassword:{
        type:String,
        required:true,
        validate:{
            validator:function(value){
                return this.Password===value;
            },
            message:"password dont match"
        }

    },
    createdAt:{type: Date,default:Date.now,immutable:true},
});

//using pre to undefined confirmpassword .. its just for validation 
userSchema.pre('save',function(next){
    this.ConfirmPassword=undefined
    next();
});

//encrypting before saving password .. 
userSchema.pre('save',async function(next){
    this.Password=await bcrypt.hash(PEPPER+this.Password,10)
    next();
})

const User=mongoose.model("User",userSchema);

//export userModel ..
export default User;


