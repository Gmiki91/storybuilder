const express = require('express');
const router = express.Router();
const Page=require('../models/Page');

router.post('/', (req,res)=>{
    var page = new Page({
        _id: req.body._id,
        content:"You arrived at an empty page."
    });
    page.save().then(() => {
        res.status(200).json("Page created")
    })
})

router.get('/:id',(req,res)=>{
    Page.findById(req.params.id).then(page => {
        res.status(200).json(page);
    })
})

module.exports = router;