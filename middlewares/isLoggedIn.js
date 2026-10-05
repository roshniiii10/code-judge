const jwt=require('jsonwebtoken');
const userModel=require('../models/user-model');

module.exports.isLoggedIn=async (req,res,next)=>{
    try{
        if(req.cookies.token==="") return res.status(401).send("you are not logged in");

        const decoded=jwt.verify(req.cookies.token,process.env.JWT_KEY);

        const user=await userModel.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({
                success : false,
                message : "Invalid token, user not found"
            });
        }

        req.user=user;
        next();

    }catch(err){
        return res.status(401).json({
            success : false,
            message : "unauthorized or token expired"
        })
    }
}