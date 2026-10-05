const express=require('express');
const router=express.Router();
const {createProblem, getAllProblems, getProblemById} = require('../controllers/problem-controller');
const {isLoggedIn}=require('../middlewares/isLoggedIn');
const {isAdmin} = require('../middlewares/isAdmin');

router.post('/create',isLoggedIn,isAdmin,createProblem);
router.get('/',getAllProblems);
router.get('/:id',getProblemById);

module.exports=router;