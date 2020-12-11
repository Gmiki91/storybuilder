const mongoose=require('mongoose');

const storySchema = mongoose.Schema({
    title:String,
    level:String,
    language:String,
    popularity:Number,
    lastUpdated:Date
})

module.exports=mongoose.model("Story",storySchema);