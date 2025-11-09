
import nodemailer from 'nodemailer';

export async function sendPasswordSetupEmail(to, token) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.tu-email.com',
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
        html: `<p>Hola, haz clic en el enlace para establecer tu contraseña:</p>
            <a href="${setupUrl}">Establecer contraseña</a>
            <p>Este enlace es válido 24 horas.</p>`
    });
}
