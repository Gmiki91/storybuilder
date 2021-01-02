const express = require('express');
const router = express.Router();
const Post= require('../models/post');

module.exports = router;

router.get('/:story/:page',(req,res)=>{
    const id = req.params.story + '/' + req.params.page;
    Post.find({pageId:id}).then((posts)=>{return res.json(posts);})
})

router.post('/postPost', (req, res)=>{
    var post = new Post({
       content:req.body.content,
       pageId:req.body.pageId,
       userName:req.body.username,
       date:new Date()
    });
    post.save().then(() => {
        res.status(200).json(post);
    })
})
