const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const secretSanta = require('./secretSanta');
const email = require('./email');

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
    sendEmails(players, assignments);
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

function sendEmails(players, assignments) {
    const emailSubject = 'Secret Santa';
    const emailText = `
        Hello, {}!\n
        Thank you for participating in Secret Santa this 2019 holliday season!\n
        The person below is who you have been assigned to give a gift to.\n
        Remember, this is called SECRET Santa for a reason, so please don't ruin it for everyone else by telling people who you are buying for!\n
        If you are struggling what to buy for your person, remember that there is the google doc that has everyone's wish list on it.\n
        You have been assigned to: {}\n
        Good luck and have fun!
    `;
    var theEmailText;
    for (var i = 0; i < players.length; i++) {
        theEmailText = emailText.replace('{}', players[i].name).replace('{}', players[assignments[i]].name);
        email.sendEmail(players[i].email, emailSubject, theEmailText);
    }
}
