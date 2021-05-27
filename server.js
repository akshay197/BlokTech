// requires
require('dotenv').config();
const { MongoClient, ObjectID } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const express = require('express');

// express
const app = express();
const port = process.env.PORT || 3000;
const nunjucks = require('nunjucks');

app.use(express.json());
app.use(express.urlencoded());

// nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

// mijn user id
const myId = '60acf87f0f70474365288d7b';

let myUser = null;
let database = null;
let users = null;

// client opzetten


const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// connecten naar database
async function connectToDatabase(err, next) {
    try {
        await client.connect();
        console.log('Connected to database');
        database = client.db('myFirstDatabase');
        users = database.collection('users');
    } catch {
        throw err;
    }
}
connectToDatabase();

// array voor de getoonde user en unknown users
let displayedUser = [];
let unknownUsers = [];

// homepage
app.get('/', (req, res) => {

    users.findOne(
        {
            _id: ObjectId(myId),
        },
        (err, user) => {
            if (err) throw err;
            myUser = user;

            // zoek naar users die niet dezelfde id hebben als mijn profiel
            users.find({ _id: { $ne: ObjectId(myId) } }).toArray((error, allUsers) => {
                if (error) throw error;
                unknownUsers = [];

                // kijk of ik een gebruiker al eerder heb gedisliked of geliked. als dat niet zo is stuur dan de gebruiker naar de unknown user array
                for (let i = 0; i < allUsers.length; i++) {
                    const otherUserId = JSON.stringify(ObjectId(allUsers[i]._id).valueOf());
                    for (let j = 0; j < myUser.dislikes.length; j++) {
                        const dislike = JSON.stringify(myUser.dislikes[j]).valueOf();
                        for (let k = 0; k < myUser.likes.length; k++) {
                            const like = JSON.stringify(myUser.likes[k]).valueOf();

                            if (dislike !== otherUserId && like !== otherUserId) {
                                unknownUsers.push(allUsers[i]);
                                console.log(unknownUsers)
                            }
                        }
                    }
                }

                // kies een willekeurige gebruiker uit om te laten zien
                displayedUser = unknownUsers[Math.floor(Math.random() * unknownUsers.length)];

                res.render('index.njk', { unknownUsers, displayedUser });
            }
            );
        });
});

// het huidige profiel kunnen liken of disliken
app.post('/', (req, res) => {
    if (req.body.preference === 'like') {
        users.updateOne(
            { _id: ObjectId(myId) },
            {
                $push: {
                    likes: displayedUser._id,
                },
            }
        );
    } else {
        users.updateOne(
            { _id: ObjectId(myId) },
            { $push: { dislikes: displayedUser._id } }
        );
    }

    // boolean voor match om te beslissen of het een match is
    let match = null;

    // check voor een match
    for (let i = 0; i < displayedUser.likes.length; i++) {
        if (JSON.stringify(displayedUser.likes[i]).valueOf() === JSON.stringify(ObjectId(myUser._id).valueOf())) {
            match = true;
        } else {
            match = false;
        }
    }

    // stuur gebruiker naar de 'its a match' pagina als er een match is.
    if (req.body.preference === 'like' && match === true) {
        res.redirect('/match')
        console.log('match')
    } else {
        res.redirect('/');
        console.log('no match')

    }
});

app.get('/match', (req, res) => {
    res.render('match.njk', { displayedUser });
});

// de matchende profielen worden hier getoond
app.get('/matches/', (req, res) => {

    users.findOne(
        {
            _id: ObjectId(myId),
        },
        (err, user) => {
            if (err) throw err;
            myUser = user;

            // zoek op alle gebruikers die niet de _id hebben van mijn (tijdelijke) gebruiker
            users.find({ _id: { $ne: ObjectId(myId) } }).toArray((error, allUsers) => {
                if (error) throw error;

                // array voor alle matches
                const userMatches = [];

                // check of een andere gebruiker mij heeft geliked en of ik hem ook heb geliked
                for (let i = 0; i < allUsers.length; i++) {
                    for (let j = 0; j < allUsers[i].likes.length; j++) {
                        for (let k = 0; k < myUser.likes.length; k++) {
                            if (JSON.stringify(allUsers[i].likes[j]).valueOf() === JSON.stringify(ObjectId(myUser._id).valueOf()) && JSON.stringify(myUser.likes[k]).valueOf() === JSON.stringify(ObjectId(allUsers[i]._id).valueOf())) {
                                // als ik een user heb geliked en hij heeft mij terug geliked, stuur hem dan naar de userMatches array
                                userMatches.push(allUsers[i])
                            }
                        }
                    }
                }
                console.log(userMatches)
                res.render('likes.njk', { userMatches });
            }
            );
        });
});

app.use(express.static('static/public'));

// error message
app.use(function (req, res, next) {
    res.status(404).send('404 pagina niet gevonden');
});

// op welke port de server draait
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
