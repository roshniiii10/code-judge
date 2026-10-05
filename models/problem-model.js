const mongoose=require('mongoose');

const testcaseSchema=mongoose.Schema({
    input :{
        type : String,
        required:true
    },
    expectedOutput:{
        type : String,
        required : true
    }
});

const problemSchema=mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    difficulty : {
        type : String,
        enum : ['easy','medium','hard'],
        default : 'easy'
    },
    testcases : [testcaseSchema]
}, {timestamps : true});

module.exports=mongoose.model('problem',problemSchema);

