require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@projecttechdatabase.kipgg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

MongoClient.connect(connectionString, { useUnifiedTopology: true })
        .then(client => {
                const db = client.db('myFirstDatabase');
                console.log('connected');
        })
        .catch(error => {
                console.log(error.message);
        });

const express = require('express');

const app = express();
const port = 3000;

const nunjucks = require('nunjucks');

app.use(express.json()) //bodyparser toegevoegd (iets dat het formulier functioneel maakt in JS)
app.use(express.urlencoded())

// nunjucks geinitiliaseerd
nunjucks.configure('views', {
        autoescape: true,
        express: app,
});

// persona array aangemaakt, objecten en properties
const personaArr = [
        {
                image: 'images/therock.jpg',
                naam: 'The Rock',
                leeftijd: '26',
                locatie: 'Amsterdam',
                beschrijving:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sapien libero, elementum eget ultricies lacinia, mattis eu ipsum.',
        },
        {
                image: 'images/ak47.jpg',
                naam: 'AK47',
                leeftijd: '47',
                locatie: 'New Delhi',
                beschrijving:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sapien libero, elementum eget ultricies lacinia, mattis eu ipsum.',
        },
        {
                image: 'images/hrithik.jpg',
                naam: 'Hrithik',
                leeftijd: '43',
                locatie: 'Mumbai',
                beschrijving:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sapien libero, elementum eget ultricies lacinia, mattis eu ipsum.',
        },
        {
                image: 'images/ironman.jpg',
                naam: 'Iron man',
                leeftijd: '40',
                locatie: 'New York',
                beschrijving:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sapien libero, elementum eget ultricies lacinia, mattis eu ipsum.',
        },
];

let likedArr = [];

// een nieuw profiel inladen 
let persona = {};
// een willekeurig profiel telkens inladen
next = () => {
        persona = personaArr[Math.floor(Math.random() * personaArr.length)];
}

// homepage
app.get('/', (req, res) => {
        // console.log(persona);
        next();
        res.render('index.njk', { persona });
});

// het huidige profiel kunnen liken of disliken
app.post('/', (req, res) => {
        persona.preference = req.body.preference;

        if(persona.preference === 'like') {
                likedArr.push(persona);
        }

        console.log(persona)
        next();
        res.render('index.njk', { persona });
});

// de gelikete profielen
app.get('/likes', (req, res) => {
        res.render('likes.njk', { likedArr });
});

app.use(express.static('static/public'));

//error message
app.use(function (req, res, next) {
        res.status(404).send('404 pagina niet gevonden');
});

//op welke port de server draait
app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
});
