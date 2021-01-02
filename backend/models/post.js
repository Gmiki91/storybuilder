const mongoose=require('mongoose');

const postSchema = mongoose.Schema({
    userName:String,
    date:Date,
    content:String,
    pageId:String
})

module.exports=mongoose.model("Post",postSchema);