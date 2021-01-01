const express = require('express');
const router = express.Router();
const Story = require('../models/story');
const Page = require('../models/page');

router.get('/all', (req, res) => {
    Story.find().then((stories) => {
        res.status(200).send(stories);
    });
})
router.get('/length/:id', (req, res) => {
    Story.findById(req.params.id).then((story) => {
        res.status(200).json(story.pages.length);
    })
        .catch((err) => { res.status(500).json({ error: err }); })
})

router.get('/one/:id', (req, res) => {
    Story.findById(req.params.id).then((story) => {
        res.status(200).json(story);
    })
        .catch((err) => { res.status(500).json({ error: "no story found" }); })
})

/* ***Stories grouped by language
*
router.post('/', async (req, res, next) => {
    var result = [];
    var promises = [];
    req.body.forEach((element) => {
        promises.push(new Promise(async (resolve, reject) => {
            await Story.find({
                "language": element
            }).then((stories) => {
                if (stories.length !== 0)
                    result.push(stories);
                resolve();
            })
        }))
    })
    Promise.all(promises).then(() => {
        return res.status(200).send(result);
    })
        .catch((err) => { res.status(500).json({ error: err }); })
})
*/


router.post('/add', (req, res, next) => {
    var story = new Story({
        title: req.body.title,
        pages: req.body.pages,
        level: req.body.level,
        language: req.body.language,
        popularity: 0,
        type: req.body.type,
        lastUpdated: new Date()
    });
    story.save().then(() => {
        res.status(200).json(story);
    })
})

router.patch('/addPages', (req, res, next) => {
    Story.updateOne({ _id: req.body.storyId },
        {
            lastUpdated: new Date(),
            $push: { pages: req.body.pageIds }
        })
        .then(() => console.log("Page added to story"))
})

router.patch('/addPage', (req, res, next) => {
    Story.updateOne({ _id: req.body.storyId },
        {
            lastUpdated: new Date(),
            $push: { pages: req.body.pageId }
        })
        .then(() =>res.status(200).json("Page added to story"))
})

router.patch('/liked', (req, res, next) => {
    Story.updateOne({ _id: req.body.id },
        { $inc: { popularity: 1 } })
        .then(() => res.status(200).json("Story popularity+1"))
})

router.patch('/unliked', (req, res, next) => {
    Story.updateOne({ _id: req.body.id },
        { $inc: { popularity: -1 } })
        .then(() => res.status(200).json("Story popularity-1"))
})

router.delete('/:id', (req, res) => {
    Story.findByIdAndDelete(req.params.id).then((result) => {
        Page.deleteMany({
            $or: [
                { _id: { $in: result.pages } },
                { storyId: { $in: result.pages } }
            ]
        }).then(() => {
            res.status(200).json("Story and pages deleted");
        })
    });
})

module.exports = router;