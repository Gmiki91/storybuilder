const ObjectId = require('mongoose').Types.ObjectId;
const express = require('express');
const router = express.Router();
const Page = require('../models/page');

router.get('/:story/:page', (req, res) => {
    const id = req.params.story + '/' + req.params.page;
    Page.findById(id).then(page => {
        res.status(200).json(page);
    })
})

router.post('/', (req, res) => {
    var page = new Page({
        _id: req.body._id,
        storyId: req.body.storyId,
        content: "You arrived at an empty page.",
        routes: [],
        route:[],
        answers:[],
     /*   question:null,
        status: 0,
        dateOfCreation: null,
        votes: 0,
        type:0,
        parentStories:null,
        collaborators:null*/
    });
    page.save().then((result) => {
        console.log(result.value);
        res.status(200).json(result._id);
    })
})


router.get('/underApproval/:story/:page', (req, res) => {
    var pageId = req.params.story + "/" + req.params.page;
    Page.find({ storyId: pageId }).then((result) => { res.status(200).json(result.routes) })
})

router.post('/underApproval', (req, res) => {
    Page.findOneAndUpdate({ _id: req.body.pageId },
        { $push: { routes: req.body.route } },{new:true})
        .then((result) => res.status(200).json(result.routes));
})

router.patch('/addRoutes', (req, res) => {
    Page.updateOne({ _id: req.body.pageId },

        { $push: { routes: req.body.routes } }

    ).then(() => res.status(200).json("Route added"))
})

router.patch('/addRoute', (req, res) => {
    Page.updateOne({ _id: req.body.pageId },

        { $push: { route: req.body.routeNameAndId } }

    ).then(() => res.status(200).json("Route added"))
})

router.patch('/pageFinished', (req, res) => {
    Page.updateOne({ _id: req.body.pageId },
        {  "status": 2 } 
    ).then(() => res.status(200).json("Page status set to 2"))
})

router.patch('/publishContent', (req, res) => {
    Page.updateOne({ _id: req.body.pageId }, {
        "content": req.body.content,
        "status": req.body.status,
        "question":req.body.question,
        "dateOfCreation": new Date(),
       $push:{answers:req.body.answers}
    }).then(() => res.status(200).json("Content updated"));
})





router.patch('/liked', (req, res) => {
    Page.updateOne({ _id: req.body.id },
        { $inc: { votes: 1 } })
        .then(() => {
            res.status(200).json("page in pages liked");
        })
})

router.patch('/unliked', (req, res) => {
    Page.updateOne({ _id: req.body.id },
        { $inc: { votes: -1 } })
        .then(() => {
            res.status(200).json("page unliked");
        })
})

module.exports = router;
