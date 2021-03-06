const mongoose=require('mongoose');

const userSchema = mongoose.Schema({
    email:String,
    password:String,
    name:String,
    points:Number,
    storyId:String,
    votedFor:[String],
    unlocked:[String],
    routeAdvised:[String],
    favorite:[String]
})

module.exports=mongoose.model("User",userSchema);