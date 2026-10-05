const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    username : {
        type : String,
        required : true,
        //if 2 users hit register button with same username at same time
        //findOne() would return null
        //without this unique, mongoDb would create duplicate accounts
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    role : {
        type : String,
        enum : ['user','admin'],
        default : 'user'
    }
}, {timestamps : true});

module.exports=mongoose.model('user',userSchema);

