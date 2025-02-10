/* eslint-disable no-undef */
import { createTransport } from 'nodemailer';

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export function sendEmailNotification(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email: ', error);
        }
        console.log('Email sent: ' + info.response);
    });
}