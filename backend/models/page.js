const mongoose=require('mongoose');

const pageSchema = mongoose.Schema({
    _id:String,
    content:String,
})

module.exports=mongoose.model("Page",pageSchema);