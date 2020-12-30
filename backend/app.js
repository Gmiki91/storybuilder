const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app=express();
const storiesRoute=require('./routes/stories');
const usersRoute=require('./routes/users');
const pagesRoute=require('./routes/pages');

mongoose.set('useFindAndModify', false);
mongoose.connect(
    "mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/storybuilder?retryWrites=true&w=majority",
    {useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{
    console.log("connected to database!");
}).catch((err)=>{
    console.log("connection to database failed" + err); 
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", 
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.setHeader("Cache-Control", "no-cache");
    next();
});

app.use("/api/stories", storiesRoute);
app.use("/api/users", usersRoute);
app.use("/api/pages", pagesRoute);

module.exports=app;
