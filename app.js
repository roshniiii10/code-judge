const express=require('express');
const app=express();
const cookieParser=require("cookie-parser");
const connectDB=require('./config/mongoose-connection');
const userRoutes=require('./routes/user-routes');
const problemRoutes=require('./routes/problem-routes');
const submissionRoutes = require('./routes/submission-routes');

require('dotenv').config();

const PORT=process.env.PORT || 3000 ;
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/users',userRoutes);
app.use('/problems',problemRoutes);
app.use('/submissions', submissionRoutes);

app.get('/',(req,res)=>{
    res.status(200).json({
        success : true,
        message : "API is up and running smoothly"
    });
})

app.listen(PORT,()=>{
    console.log(`Server running on port, ${PORT}`);
});