const mongoose=require('mongoose');

const pageSchema = mongoose.Schema({
    _id:String,
    storyId:String,
    content:String,
    routes:[Object],
    route:[String],
    status:Number,
    votes:Number,
    dateOfCreation:Date,
    type:Number,
    question:String,
    answers:[String],
    collaborators:[String],
    parentStories:[String]
})

module.exports=mongoose.model("Page",pageSchema);