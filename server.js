const express = require('express')
const app = express()
const port = 3000

let nunjucks = require('nunjucks');

nunjucks.configure('views',{
  autoescape: true,
  express: app
});

app.get('/', (req, res) => {
  res.render('index.njk')
})

app.get('/modes', (req, res) => {
  res.send('Battle Royale')
})

app.use(express.static("static/public"))

app.get('/modes/:modeId/:slug', (req, res) => {
  res.send(`Je bevind je nu op de pagina van de mode: ${req.params.slug}`)
})

app.use(function(req,res,next){
  res.status(404).send('404 pagina niet gevonden')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

