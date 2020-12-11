const mongoose=require('mongoose');

const userSchema = mongoose.Schema({
    email:String,
    password:String,
    languages:[Object],
    points:Number,
    votedFor:[String]
})

module.exports=mongoose.model("User",userSchema);