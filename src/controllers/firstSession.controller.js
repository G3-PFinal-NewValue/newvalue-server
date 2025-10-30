// src/controllers/firstSession.controller.js
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import transporter from "../config/nodemailer.js";

export const createUserAndSendEmail = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      firstLastName,
      secondLastName,
      phone,
      address,
      city,
      province,
      country,
      postalCode,
      dni,
      reason,
      feeling,
      timeFeeling,
      previousTherapy,
      availability,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: `${firstLastName} ${secondLastName}`,
      phone,
      role_id: 3, // paciente
    });

    // Enviar correo
    await transporter.sendMail({
      from: `"Cora Mind" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Registro completado",
      html: `
        <p>Hola ${firstName},</p>
        <p>Tu usuario ha sido creado correctamente. Puedes iniciar sesión con tu email.</p>
        <p>Gracias por registrarte en Cora Mind.</p>
      `,
    });

    res.status(201).json({ message: "Usuario creado y email enviado", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando usuario o enviando email", error: error.message });
  }
};
