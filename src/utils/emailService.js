import nodemailer from 'nodemailer';
import { setPasswordEmailTemplate } from '../utils/setPasswordEmailTemplate.js';

export async function sendPasswordSetupEmail(to, token, firstName = '') {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const setupUrl = `${process.env.FRONTEND_URL}/set-password/${token}`;

    await transporter.sendMail({
        from: '"Cora Mind" <coramind.newvalue@gmail.com>',
        to,
        subject: 'Establece tu contraseña',
        html: setPasswordEmailTemplate(firstName, setupUrl)
    });
}
