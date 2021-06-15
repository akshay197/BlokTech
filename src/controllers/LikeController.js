/**
 * Like Controller
 */

const User = require('../models/User');

const myUserId = '60c8f68cf1bae2b3c7006459';
let myUser;
let displayedUser;
let unknownUsers;
let match;

const getSimilarUsers = (req, res) => {
    User.find({}, (err, users) => {
        if (err) throw err;

        myUser = [...new Set(users)].filter((user) => user._id == myUserId).shift();

        const potentialMatches = [...new Set(users)].filter((user) => user._id != myUserId);

        unknownUsers = potentialMatches.filter(
            (potentialMatch) =>
                !potentialMatch.likedBy.includes(myUserId) && !potentialMatch.dislikedBy.includes(myUserId)
        );

        displayedUser = unknownUsers[Math.floor(Math.random() * unknownUsers.length)];

        res.render('index.njk', { unknownUsers, displayedUser });
    });
};

const userPreference = (req, res) => {
    if (req.body.preference === 'like') {
        User.updateOne({ _id: displayedUser._id }, { $push: { likedBy: myUser._id } }, (err) => {
            if (err) throw err;
        });
    } else {
        User.updateOne({ _id: displayedUser._id }, { $push: { dislikedBy: myUser._id } }, (err) => {
            if (err) throw err;
        });
    }

    console.log(req.body);

    if (req.body.preference === 'like' && myUser.likedBy.includes(displayedUser._id)) {
        res.redirect('/match');
        match = true;
    } else {
        res.redirect('/');
        match = false;
    }
};

const getMatch = (req, res) => {
    if (match === true) {
        res.render('match.njk', { displayedUser, myUser });
        match = null;
    } else {
        res.redirect('/');
    }
};

const getAllMatches = (req, res) => {
    User.find({}, (err, users) => {
        if (err) throw err;

        myUser = [...new Set(users)].filter((user) => user._id == myUserId).shift();

        const potentialMatches = [...new Set(users)].filter((user) => user._id != myUserId);

        const matches = potentialMatches.filter(
            (potentialMatch) => potentialMatch.likedBy.includes(myUserId) && myUser.likedBy.includes(potentialMatch._id)
        );

        res.render('matches.njk', { matches });
    });
};

module.exports = { getSimilarUsers, userPreference, getMatch, getAllMatches };
