const express = require('express');
const router = express.Router();
const Page = require('../models/page');

router.post('/', (req, res) => {
    var page = new Page({
        _id: req.body._id,
        storyId: req.body.storyId,
        content: "You arrived at an empty page.",
        routes: req.body.routes,
        status: 0
    });
    page.save().then((result) => {
        res.status(200).json(result._id);
    })
})
router.patch('/addRoute', (req, res) => {
    console.log(req.body);
    Page.updateOne({ _id: req.body.pageId },
        {
            $addToSet: {routes: {$each:[ req.body.routeName, req.body.routeId]}}
        }
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
    Page.updateOne({ _id: req.body.pageId }, {
        "content": req.body.content,
        "status": 1
    }).then(() => res.status(200).json("Content updated"));
})

router.get('/:story/:page', (req, res) => {
    const id = req.params.story + '/' + req.params.page;
    Page.findById(id).then(page => {
        res.status(200).json(page);
    })
})


module.exports = router;
