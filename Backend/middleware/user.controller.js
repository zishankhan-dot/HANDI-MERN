import User from "../models/user.models.js";
// middleware to create new user 

export const NewUser=async (req,res)=>{
    const {Name,Email,PhoneNumber,Password,ConfirmPassword}=req.body;
    console.log(req.body)
    const existingUser=await User.findOne({Email});
    if(!Password||!Email){
        res.status(400).json({message:"Error Email or password"})
    }
    
    else if(existingUser){
        res.status(400).json({message:"USER ALREADY EXIST !!"})
    }
    else{
        try{
        const newUser=new User({Name,Email,PhoneNumber,Password,ConfirmPassword});
        await newUser.save();
        res.status(200).json({message:"User Created"})}
        catch(err){
            console.error(err);
            res.status(400).message({message:"User Registration failed !!"});
        }

    }
    

}


// middleware to validate user and create token 
export const loginUser=async (req,res)=>{
   const {Email,Password}=req.body;
   if(!Email || !Password){return res.status(400).json({message:"Please input mail and password !!"})}

// checking for user in User table 
   const isUser= await User.findOne({Email})
   if(!isUser){return res.status(402).json({message:"EMAIL NOT FOUND!!"})}
// pepper = some random string 
   const isPassword=await bcrypt.compare(pepper+Password,isUser.Password);
   if(!isPassword){return res.status(402).json({message:"PASSWORD INCORRECT!!"})}
   const token=jwt.sign({
    userId:isUser._id,
    Email:isUser.Email
   },secretkey,{expiresIn:"2h"});

   /// setting token to cookie ..
   res.cookie("authorization",token,{
    maxAge:3600000  // 60 mins 60*60*100
   })
  return res.status(200).json({
    message:"login successful",
    role:"User"

   })
}

// Middleware to check token and also it shares the user_id to next middle ware 
export const checkTokenShareUserDetail=(req,res,next)=>{
    const token=req.cookies.authorization;
    //checking cookie 
    console.log(req.cookies);
    if(!token){
        return res.status(402).json({message:"token not found , login again!!!!"})
    }
    try{
       const decode= jwt.verify(token,secretkey)
        req.userData=decode;
        console.log("successfull verification !!");
        console.log(decode)
        next();
    
    }
    catch(error){
        console.log(error)
        return res.status(402).json({message:"failed token verification !! login again"})
         
         
    }
}