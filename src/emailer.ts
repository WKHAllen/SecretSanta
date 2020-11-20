import * as nodemailer from 'nodemailer';

export const emailAddress = (process.env.EMAIL_ADDRESS as string);
const emailPassword = process.env.EMAIL_APP_PASSWORD;

async function wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function sendEmail(emailTo: string, subject: string, html: string, text?: string, tryNum: number = 1): Promise<void> {
    return new Promise((resolve) => {
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
            if (err) {
                console.warn(`Error sending email to '${emailTo}' (try ${tryNum}):\n`, err);
                wait(60 * 1000)
                    .then(() => {
                        sendEmail(emailTo, subject, html, text, tryNum + 1)
                            .then(resolve);
                    });
            } else {
                resolve();
            }
        });
    });
}
