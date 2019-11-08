const nodemailer = require('nodemailer');
try {
    const loginInfo = require('./loginInfo').default;
    var emailAddress = loginInfo.email;
    var emailPassword = loginInfo.appPassword;
} catch (err) {
    var emailAddress = process.env.EMAIL_ADDRESS;
    var emailPassword = process.env.EMAIL_APP_PASSWORD;
}

function sendEmail(emailTo, subject, text) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: emailAddress,
            pass: emailPassword
        }
    });
    var mailOptions = {
        from: emailAddress,
        to: emailTo,
        subject: subject,
        text: text
    }
    transporter.sendMail(mailOptions, (err, info) => {
        // In case gsmtp servers encounter problems (they have before)
        if (err) {
            console.log('Error sending emails (try 1):', err);
            setTimeout(() => {
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log('Error sending emails (try 2):', err);
                        setTimeout(() => {
                            transporter.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                    console.log('Error sending emails (try 3)');
                                    throw err;
                                }
                            });
                        }, 10 * 60 * 1000);
                    }
                });
            }, 60 * 1000);
        }
    });
}

module.exports = {
    'sendEmail': sendEmail
}
