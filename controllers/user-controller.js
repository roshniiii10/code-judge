const userModel=require('../models/user-model');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");


module.exports.registerUser=async (req,res)=>{
    try{
        let {username, email, password,role}=req.body;

        const existingUser = await userModel.findOne({$or :[{email},{username}]});
        if(existingUser) return res.status(400).json({
            success : false,
            message : "user or email already registered"
        });

        const salt=await bcrypt.genSalt(10);
        const hash=await bcrypt.hash(password,salt);

        let user = await userModel.create({
            username,
            email,
            password : hash,
            role
        });

        let token=jwt.sign({email, id :user._id},process.env.JWT_KEY);
        res.cookie("token",token);
        return res.status(201).send("user registered successfully");

    }catch(err){
        return res.status(400).json({
            success : false,
            message : err.message
        });
    }
    
}

module.exports.loginUser=async (req,res)=>{
    try{
        let {username,password}=req.body;

        let user=await userModel.findOne({username});
        if(!user) return res.status(400).send("username or password incorrect");

        const result = bcrypt.compare(password,user.password);
        if(!result) return res.status(400).send("incorrect password");
        let token=jwt.sign({username, id :user._id},process.env.JWT_KEY);
        res.cookie("token",token);
        

        return res.status(200).json({
            success:true,
            message : "logged in successfully"
        })

    }catch(err){
        res.status(400).json({
            success:false,
            message : err.message
        });
    }
}

module.exports.logoutUser=(req,res)=>{
    res.clearCookie("token");
    return res.status(200).send("logged out");
}