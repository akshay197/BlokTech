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

// nunjucks configuratie
nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

// mijn user id uit de database zodat er later mee geliked kan worden
const myId = '60acf87f0f70474365288d7b';

// variabelen die leeg zijn omdat je later voor meerdere scopes nodig hebt
let myUser = null;
let database = null;
let users = null;

// client opzetten/configuratie
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

// home - route
app.get('/', (req, res) => {
    // Uit de collectie users, pik ik de user uit die mijn user id heeft  
    users.findOne(
        // Dit is de query waarin ik mijn user id opvraag dmv mijn id variabel
        {
            _id: ObjectId(myId),
        },
        (err, user) => {
            if (err) throw err; // error laten zien voor als iets fout gaat
            myUser = user;

            // zoek naar users die niet dezelfde id hebben als mijn profiel
            users.find({ _id: { $ne: ObjectId(myId) } }).toArray((error, allUsers) => {
                if (error) throw error;
                unknownUsers = [];

                // kijk of ik een gebruiker al eerder heb gedisliked of geliked. als dat niet zo is stuur dan de gebruiker naar de unknown user array
                // Objectid met elkaar vergelijken gaf altijd false dus daarom JSON.stringify
                // 1e loop door alle gebruikers
                for (let i = 0; i < allUsers.length; i++) {
                    const otherUserId = JSON.stringify(ObjectId(allUsers[i]._id).valueOf());
                    // 2e loop voor mijn dislikes door mij
                    for (let j = 0; j < myUser.dislikes.length; j++) {
                        const dislike = JSON.stringify(myUser.dislikes[j]).valueOf();
                        // 3e loop voor alle likes door mij
                        for (let k = 0; k < myUser.likes.length; k++) {
                            const like = JSON.stringify(myUser.likes[k]).valueOf();
                            // Als een like/dislike niet gelijk is aan een andere user id, dan wordt hij toegevoegd aan de onbekende gebruikers array (unknown users)   
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

// het huidige profiel kunnen liken of disliken in de home route
app.post('/', (req, res) => {
    if (req.body.preference === 'like') { //als de gebruiker een like geeft, dan update hij mijn gelikete profielen door de user id van de getoonde gebruiker er in te stoppen
        users.updateOne(
            { _id: ObjectId(myId) },
            {
                $push: {
                    likes: displayedUser._id,
                },
            }
        );
    } else { // als de gebruiker een dislike geeft, dan update hij mijn gedislikete profielen door de user id van de getoonde gebruiker er in te stoppen // je hebt maar 2 opties: liken of disliken
        users.updateOne(
            { _id: ObjectId(myId) },
            { $push: { dislikes: displayedUser._id } }
        );
    }

    // boolean voor variabel match
    let match = null;

    // loop door de getoonde gebruikers zijn likes
    for (let i = 0; i < displayedUser.likes.length; i++) {
        if (JSON.stringify(displayedUser.likes[i]).valueOf() === JSON.stringify(ObjectId(myUser._id).valueOf())) { // als een van de getoonde gebruikers mij liken, dan match=true anders match=false
            match = true;
        } else {
            match = false;
        }
    }

    // stuur gebruiker naar de 'its a match' pagina als er een match is. Een match ontstaat wanneer ik die gebruiker like en zij/hij mij.
    if (req.body.preference === 'like' && match === true) {
        res.redirect('/match')
        console.log('match')
    } else {
        res.redirect('/');
        console.log('no match')

    }
});

// laat zien dat er een match is ontstaan
app.get('/match', (req, res) => {
    res.render('match.njk', { displayedUser });
});

// de matchende profielen worden hier getoond in deze route getoond
app.get('/matches/', (req, res) => {
    // query: zoek eerst voor mijn gebruiker
    users.findOne(
        {
            _id: ObjectId(myId),
        },
        (err, user) => {
            if (err) throw err;
            myUser = user; // deze user is het zoekresultaat van de bovenstaande query 

            // zoek op alle gebruikers die niet de _id hebben van mijn (tijdelijke) gebruiker
            users.find({ _id: { $ne: ObjectId(myId) } }).toArray((err, allUsers) => {
                if (err) throw err;

                // array voor alle matches
                const userMatches = [];

                for (let i = 0; i < allUsers.length; i++) { // loop door alle gebruikers
                    for (let j = 0; j < allUsers[i].likes.length; j++) { // loop door gelikete gebruikers door andere gebruikers
                        for (let k = 0; k < myUser.likes.length; k++) { // loop door gelikete gebruikers door mij
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
