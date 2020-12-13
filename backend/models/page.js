const mongoose=require('mongoose');

const pageSchema = mongoose.Schema({
    _id:String,
    content:String,
    routes:[String],
    status:Number
})

module.exports=mongoose.model("Page",pageSchema);