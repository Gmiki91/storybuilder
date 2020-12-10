const express = require('express');
const router = express.Router();
const Story = require('../models/story');

router.post('/', async (req, res, next) => {
    var result = [];
    var promises = [];
    req.body.forEach((element) => {
        promises.push(new Promise(async (resolve, reject) => {
            await Story.find({
                "language": element.language,
                "level": { $lte: element.level }
            }).then((stories) => {
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
        level: req.body.level,
        language: req.body.language
    });
    story.save().then(() => {
        res.status(201).json("Story created")
    })
})

module.exports = router;