const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const secretSanta = require('./secretSanta');

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
    res.render('index', { js: ['main'] });
});

app.post('/', (req, res) => {
    var players = parseForm(req.body);
    var assignments = secretSanta.getRandomAssignments(players.length);
    // TODO: send emails
    res.redirect('/success');
});

app.get('/success', (req, res) => {
    res.render('success', { title: 'Success' });
});

app.use((req, res, next) => {
    res.status(404).render('404', { title: '404' });
});

app.use((err, req, res, next) => {
    res.status(500).render('500', { title: '500' });
    if (err) console.log(err);
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

function parseForm(form) {
    var players = [];
    var formKeys = Object.keys(form);
    var numId;
    var emailKey;
    for (var formKey of formKeys) {
        if (formKey.startsWith('name-')) {
            numId = formKey.slice(5);
            emailKey = `email-${numId}`;
            if (formKeys.includes(emailKey)) {
                players.push({ name: form[formKey], email: form[emailKey] });
            }
        }
    }
    return players;
}
