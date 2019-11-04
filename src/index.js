const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const port = process.env.PORT || 3000;
const staticPath = path.join(__dirname, 'static');

var app = express();

app.engine('.html', hbs({
    extname: '.html',
    defaultView: 'default',
    defaultLayout: 'default'
}));
app.set('view engine', '.html');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(staticPath));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    // TODO: application logic
    res.render('success');
});

app.use((req, res, next) => {
    res.status(404).render('404');
});

app.use((err, req, res, next) => {
    res.status(500).render('500');
    if (err) console.log(err);
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
