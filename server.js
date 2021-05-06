const express = require('express');

const app = express();
const port = 3000;

const nunjucks = require('nunjucks');

nunjucks.configure('views', {
        autoescape: true,
        express: app,
});

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

app.get('/', (req, res) => {
        const persona = personaArr[Math.floor(Math.random() * personaArr.length)];
        console.log(persona);
        res.render('index.njk', { persona });
});

app.get('/modes', (req, res) => {
        res.send('Battle Royale');
});

app.use(express.static('static/public'));

app.get('/modes/:modeId/:slug', (req, res) => {
        res.send(`Je bevind je nu op de pagina van de mode: ${req.params.slug}`);
});

app.use(function (req, res, next) {
        res.status(404).send('404 pagina niet gevonden');
});

app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
});
