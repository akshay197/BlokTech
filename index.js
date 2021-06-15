// Required modules
const express = require('express');
const nunjucks = require('nunjucks');

const router = require('./src/routes/router');

// Imported functions
const connectToDatabase = require('./src/tools/connectDatabase');

// Variables from modules
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

// Configure nunjucks
nunjucks.configure('src/views/', {
    autoescape: true,
    express: app,
});

// Serve static files
app.use(express.static('static/public'));

// Use body-parser express extension
app.use(express.json());
app.use(express.urlencoded());

// Use the routes in the router
app.use('/', router);

connectToDatabase();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
