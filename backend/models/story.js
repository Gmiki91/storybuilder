const mongoose=require('mongoose');

const storySchema = mongoose.Schema({
    title:String,
    desc:String,
    pages:[String],
    level:String,
    language:String,
    type:Number,
    popularity:Number,
    lastUpdated:Date
})

module.exports=mongoose.model("Story",storySchema);