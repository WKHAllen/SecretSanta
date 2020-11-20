import * as express from 'express';
import * as hbs from 'express-handlebars';
import * as bodyParser from 'body-parser';
import * as secretSanta from './secretSanta';
import * as email from './emailer';

const port = process.env.PORT || 3000;
const debug = Boolean(Number(process.env.DEBUG));

const emailSubject = 'Secret Santa';
const emailText = 'Hello, {}!\n\n{}\n\nYou have been assigned to: {}\n';
const defaultEmailBody = `Thank you for participating in Secret Santa this holiday season!\nThe person below is who you have been assigned to give a gift to.\nRemember not to tell anyone who you have been assigned!`;

const app = express();

app.engine('.html', hbs({
    extname: '.html',
    defaultLayout: 'default'
}));
app.set('view engine', '.html');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('static'));

app.get('/', (req, res) => {
    res.render('index', { js: ['main'], defaultEmailBody: defaultEmailBody });
});

app.post('/', (req, res) => {
    const players = parseForm(req.body);
    const assignments = secretSanta.getRandomAssignments(players.length);
    sendEmails(players, assignments, req.body['main-email-body']);
    res.redirect('/success');
});

app.get('/success', (req, res) => {
    res.render('success', { title: 'Success' });
});

app.use((req, res, next) => {
    res.status(404).render('404', { title: '404' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	const options = !debug ? {} : {
		name: err.name,
		message: err.message,
		stack: err.stack
	};
	res.status(500).render('500', Object.assign(options, { title: 'Internal server error' }));
	console.error(err.stack);
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

function replaceString(str: string, ...values: string[]): string {
    let newString = str;
    for (const value of values)
        newString = newString.replace('{}', value);
    return newString;
}

function parseForm(form: any): any[] {
    let players = [];
    const formKeys = Object.keys(form);
    let numId: string;
    let emailKey: string;
    for (const formKey of formKeys) {
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

function sendEmails(players: any[], assignments: number[], emailBody: string) {
    if (emailBody === undefined)
        emailBody = defaultEmailBody;
    let theEmailText;
    for (let i = 0; i < players.length; i++) {
        theEmailText = replaceString(emailText, players[i].name, emailBody, players[assignments[i]].name);
        email.sendEmail(players[i].email, emailSubject, theEmailText);
    }
}
