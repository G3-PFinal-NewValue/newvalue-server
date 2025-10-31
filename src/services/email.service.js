import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendUserConfirmation(user) {
  const mailOptions = {
    from: `"Cora Mind" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Confirmación de registro",
    text: `Hola ${user.first_name},\n\nTu registro ha sido exitoso en Cora Mind.`,
    html: `<p>Hola <strong>${user.first_name}</strong>,</p><p>Tu registro ha sido exitoso en <strong>Cora Mind</strong>.</p>`,
  };

  const adminCopy = {
    from: `"Cora Mind" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "Nuevo registro de usuario",
    text: `Se ha registrado un nuevo usuario: ${user.email}`,
  };

  await transporter.sendMail(mailOptions);
  await transporter.sendMail(adminCopy);
}