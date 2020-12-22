const express = require('express');
const router = express.Router();
const Page = require('../models/page');

router.post('/', (req, res) => {
    var page = new Page({
        _id: req.body._id,
        storyId: req.body.storyId,
        content: "You arrived at an empty page.",
        routes: req.body.routes,
        status: 0,
        dateOfCreation: null,
        author: null,
        votes: req.body.votes

    });
    page.save().then((result) => {
        res.status(200).json(result._id);
    })
})

router.post('/many', (req, res) => {
    Page.collection.insertMany(req.body)
        .then((result) => {
            res.status(200).json(result.ops);
        })
})

router.patch('/addRoutes', (req, res) => {
    Page.updateOne({ _id: req.body.pageId },

        { $push: { routes: req.body.routes } }

    ).then(() => res.status(200).json("Route added"))
})

router.patch('/removeRoute', (req, res) => {
    Page.updateOne({ _id: req.body.pageId },
        {
            $pull: { routes: req.body.routeId },
            $pull: { routes: req.body.routeName }
        }
    ).then(() => res.status(200).json("Route removed"));
})

router.patch('/publishContent', (req, res) => {
    Page.updateOne({ _id: req.body.data.pageId }, {
        "content": req.body.data.content,
        "status": 1,
        "dateOfCreation": new Date(),
        "author": req.body.user
    }).then(() => res.status(200).json("Content updated"));
})

router.get('/:story/:page', (req, res) => {
    const id = req.params.story + '/' + req.params.page;
    Page.findById(id).then(page => {
        res.status(200).json(page);
    })
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
