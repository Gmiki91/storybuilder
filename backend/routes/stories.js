const express = require('express');
const router = express.Router();
const Story = require('../models/story');
const Page = require('../models/page');

router.get('/', (req, res) => {
    Story.find().then((stories) => {
        res.status(200).send(stories);
    });
})
router.get('/:title', (req, res) => {
    Story.findOne({ title: req.params.title }).then((story) => {
        res.status(200).json(story.pages.length);
    })
})

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

router.post('/add', (req, res, next) => {
    var story = new Story({
        title: req.body.title,
        pages: req.body.pages,
        level: req.body.level,
        language: req.body.language,
        popularity: 0,
        lastUpdated: new Date()
    });
    story.save().then(() => {
        res.status(200).json("Story created")
    })
})

router.patch('/addPage', (req, res, next) => {
    Story.updateOne({ title: req.body.storyTitle },
        { $push: { pages: req.body.pageId } })
        .then(() => console.log("Page added to story"))
})

router.delete('/:title', (req, res) => {
    Story.findOneAndDelete({ title: req.params.title }).then((result) => {
        Page.deleteMany({ _id: { $in: result.pages } }).then(() => {
            res.status(200).json("Story and pages deleted");
        })
    });
})

module.exports = router;