const mongoose=require('mongoose');

const storySchema = mongoose.Schema({
    title:String,
    level:Number,
    language:String,
    popularity:Number,
    lastUpdated:Date
})

module.exports=mongoose.model("Story",storySchema);