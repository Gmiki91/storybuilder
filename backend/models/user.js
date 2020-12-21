const mongoose=require('mongoose');

const userSchema = mongoose.Schema({
    email:String,
    password:String,
    points:Number,
    storyId:String,
    votedFor:[String]
})

module.exports=mongoose.model("User",userSchema);