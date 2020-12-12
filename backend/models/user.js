const mongoose=require('mongoose');

const userSchema = mongoose.Schema({
    email:String,
    password:String,
    points:Number,
    votedFor:[String]
})

module.exports=mongoose.model("User",userSchema);