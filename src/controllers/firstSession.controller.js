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
      password_hash: await bcrypt.hash(password, 10),
      first_name: firstName,
      last_name: `${firstLastName} ${secondLastName}`,
      phone,
      postal_code: postalCode,
      province,
      full_address: address,
      city,
      country,
      dni_nie_cif: dni,
      role_id: 3,
    });

    // Enviar correo
    await transporter.sendMail({
      from: `"Cora Mind" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Registro completado - Cora Mind",
      html: `
    <h3>Hola ${firstName},</h3>
    <p>Tu usuario ha sido creado correctamente. Puedes iniciar sesión con tu email para completar tu perfil.</p>
    <p>Nos pondremos en contacto contigo brevemente para agendar una primera consulta gratuita.</p>
    <p>Gracias por registrarte en Cora Mind.</p>

    <p>Información sobre tu situación actual:</p>
    <ul>
      <li><strong>Razón de acudir a terapia:</strong> ${reason}</li>
      <li><strong>Cómo te sientes:</strong> ${feeling}</li>
      <li><strong>Tiempo con esta sensación:</strong> ${timeFeeling}</li>
      <li><strong>Terapias anteriores:</strong> ${previousTherapy}</li>
      <li><strong>Disponibilidad:</strong> ${availability}</li>
    </ul>
  `,
    });

    res.status(201).json({ message: "Usuario creado y email enviado", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando usuario o enviando email", error: error.message });
  }
};
