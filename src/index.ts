const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const secretSanta = require('./secretSanta');
const email = require('./email');

const port = process.env.PORT || 3000;

const emailSubject = 'Secret Santa';
const emailText = 'Hello, {}!\n\n{}\n\nYou have been assigned to: {}\n';
const defaultEmailBody = `Thank you for participating in Secret Santa this holiday season!\nThe person below is who you have been assigned to give a gift to.\nRemember not to tell anyone who you have been assigned!`;

var app = express();

app.engine('.html', hbs({
    extname: '.html',
    defaultView: 'default',
    defaultLayout: 'default'
}));
app.set('view engine', '.html');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('static'));

app.get('/', (req, res) => {
    res.render('index', { js: ['main'], defaultEmailBody: defaultEmailBody });
});

app.post('/', (req, res) => {
    var players = parseForm(req.body);
    var assignments = secretSanta.getRandomAssignments(players.length);
    sendEmails(players, assignments, req.body['main-email-body']);
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

function replaceString(string, ...values) {
    var newString = string;
    for (var value of values)
        newString = newString.replace('{}', value);
    return newString;
}

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

function sendEmails(players, assignments, emailBody) {
    if (emailBody === undefined)
        emailBody = defaultEmailBody;
    var theEmailText;
    for (var i = 0; i < players.length; i++) {
        theEmailText = replaceString(emailText, players[i].name, emailBody, players[assignments[i]].name);
        email.sendEmail(players[i].email, emailSubject, theEmailText);
    }
}
