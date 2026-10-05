const express=require('express');
const router=express.Router();
const {isLoggedIn}=require('../middlewares/isLoggedIn');

const {registerUser, loginUser, logoutUser}=require('../controllers/user-controller');

router.get('/',(req,res)=>{
    res.send("user-route is working");
})

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);

router.get('/profile',isLoggedIn,(req,res)=>{
    res.status(200).json({
        success:true,
        user : req.user
    })
})

module.exports=router;

