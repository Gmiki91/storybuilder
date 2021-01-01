const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            user = new User({
                email: req.body.email,
                password: hash,
                name:req.body.name,
                storyId: req.body.storyId,
                points: req.body.points,
                votedFor: req.body.votedFor,
                favorite:req.body.favorite,
                unlocked:req.body.unlocked,
                routeAdvised:req.body.routeAdvised
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: "user created",
                        result: result
                    });
                })
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
});

router.post('/login', (req, res, next) => {
    let userData;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            userData = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const token = jwt.sign(
                { name: userData.name, userId: userData._id },
                'lol_not_very_cryptic',
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token: token,
                user: userData
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Auth failed"
            });
        })
})

router.get('/updated/:email', (req, res) => {
    User.findOne({ email: req.params.email })
        .then(user => { res.status(200).json(user) })
})

router.patch('/addStory', (req, res) => {
    User.updateOne({ email: req.body.email },
        { "storyId": req.body.storyId }).then(() => res.status(200).json("Story updated"));
})

router.patch('/deleteStory', (req, res) => {
    User.updateOne({ email: req.body.email },
        { "storyId":null }).then(() => res.status(200).json("Story deleted"));
})

router.patch('/likePage', (req, res) => {
    User.updateOne({ email: req.body.email },
        { $push: {votedFor:  req.body.pageId}})
        .then((user) => res.status(200).json(user));
})
router.patch('/unlikePage', (req, res) => {
    User.updateOne({ email: req.body.email },
        { $pull: {votedFor:  req.body.pageId}})
        .then((user) => res.status(200).json(user));
})
router.patch('/unlockPage', (req, res) => {
    User.updateOne({ email: req.body.email },
        { $push: {unlocked:  req.body.pageId}})
        .then((user) => res.status(200).json(user));
})
router.patch('/routeAdvised', (req, res) => {
    User.updateOne({ email: req.body.email },
        { $push: {routeAdvised:  req.body.pageId}})
        .then((user) => res.status(200).json(user));
})

module.exports = router;