const mongoose=require('mongoose');

const pageSchema = mongoose.Schema({
    _id:String,
    storyId:String,
    content:String,
    routes:[String],
    status:Number,
    author:Object,
    votes:Number,
    dateOfCreation:Date
})

module.exports=mongoose.model("Page",pageSchema);