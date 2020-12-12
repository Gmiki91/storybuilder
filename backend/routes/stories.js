const express = require('express');
const router = express.Router();
const Story = require('../models/story');

router.get('/', (req, res) => {
    Story.find().then((stories) => {
        res.status(200).send(stories);
    });
})

router.post('/', async (req, res, next) => {
    var result = [];
    var promises = [];
    req.body.forEach((element) => {
        promises.push(new Promise(async (resolve, reject) => {
            await Story.find({
                "language": element.language,
                "level":  element.level 
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
        pages: [req.body.title+"1"],
        level: req.body.level,
        language: req.body.language,
        popularity: 0,
        lastUpdated: new Date()
    });
    story.save().then(() => {
        res.status(200).json("Story created")
    })
})

module.exports = router;