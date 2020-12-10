const mongoose=require('mongoose');

const storySchema = mongoose.Schema({
    title:String,
    level:Number,
    language:String,
})

module.exports=mongoose.model("Story",storySchema);