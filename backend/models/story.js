const mongoose=require('mongoose');

const storySchema = mongoose.Schema({
    title:String,
    desc:String,
    pages:[String],
    level:String,
    language:String,
    popularity:Number,
    lastUpdated:Date,
    finished:Boolean
})

module.exports=mongoose.model("Story",storySchema);