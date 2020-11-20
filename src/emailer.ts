import * as nodemailer from 'nodemailer';

export const emailAddress = (process.env.EMAIL_ADDRESS as string);
const emailPassword = process.env.EMAIL_APP_PASSWORD;

export function sendEmail(emailTo: string, subject: string, html: string, text?: string) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: emailAddress,
            pass: emailPassword
        }
    });
    const mailOptions = {
        from: {
            name: 'Secret Santa',
            address: emailAddress
        },
        to: emailTo,
        subject: subject,
        html: html,
        text: text
    };
    transporter.sendMail(mailOptions, (err, info) => {
        // In case gsmtp servers encounter problems (they have before)
        if (err) {
            console.warn('Error sending emails (try 1):', err);
            setTimeout(() => {
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.warn('Error sending emails (try 2):', err);
                        setTimeout(() => {
                            transporter.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                    console.warn('Error sending emails (try 3):');
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