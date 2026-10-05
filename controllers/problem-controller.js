const problemModel=require('../models/problem-model');

module.exports.createProblem=async (req,res)=>{
    try{
        const {title, description, difficulty, testcases}=req.body;

        const problem=await problemModel.create({
            title, 
            description, 
            difficulty, 
            testcases
        });

        return res.status(200).json({
            success : true,
            message : "problem created successfully"
        });
    }catch(err){
        return res.status(401).json({
            success : false,
            message : err.message
        });
    }
}

module.exports.getAllProblems=async (req,res)=>{
    try{
        const problems=await problemModel.find().select('-testcases');

        return res.status(200).json({
            success : true,
            count : problems.length,
            data : problems
        });
    }catch(err){
        return res.status(500).json({
            success : false,
            message : err.message
        });
    }
}


module.exports.getProblemById=async (req,res)=>{
    try{
        const problem=await problemModel.findById(req.params.id);

        if(!problem) return res.status(404).json({
            success : false,
            message : "problem not found"
        });

        return res.status(200).json({
            success : true,
            data : problem
        });
    }catch(err){
        return res.status(500).json({
            success : false,
            message : err.message
        });
    }
}
