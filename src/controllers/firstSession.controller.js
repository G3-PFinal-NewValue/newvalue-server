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
      postal_code: postalCode,
      province,
      full_address: address,
      city,
      country,
      dni_nie_cif: dni,
      role_id: 3,
    });

    // === PLANTILLA DE ESTILO ===
    const emailStyles = `
      background-color: #f4f1e8;
      font-family: 'Visby', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
      color: #333333;
      font-size: 16px;
      line-height: 1.6;
      padding: 30px 20px;
    `;

    const cardStyles = `
      background-color: #ede3d2;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      margin-top: 20px;
    `;

    const titleStyles = `
      font-family: 'Opun', system-ui, sans-serif;
      color: #295b6e;
      font-size: 22px;
      margin-bottom: 10px;
    `;

    const brandColor = "#ee9271";

    // === Correo al paciente ===
    const userMailOptions = {
      from: `"Cora Mind" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Confirmación de registro - Cora Mind",
      html: `
      <div style="${emailStyles}">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="https://res.cloudinary.com/dkm0ahny1/image/upload/v1762168143/coramind-logo-email_aiwngo.png" alt="Cora Mind" width="140" style="margin-bottom: 10px;" />
          <h2 style="color: ${brandColor}; margin: 0;">Bienvenida a Cora Mind</h2>
        </div>

        <p>Hola <strong>${firstName}</strong>,</p>
        <p>Gracias por registrarte en <strong>Cora Mind</strong>. Tu cuenta ha sido creada correctamente.</p>
        <p>Puedes iniciar sesión con tu correo electrónico para completar tu perfil y agendar tu primera sesión.</p>

        <div style="${cardStyles}">
          <h3 style="${titleStyles}">Datos de tu registro</h3>
          <ul style="padding-left: 20px; margin: 0;">
            <li><strong>Nombre completo:</strong> ${firstName} ${firstLastName} ${secondLastName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Teléfono:</strong> ${phone}</li>
            <li><strong>Dirección:</strong> ${address}, ${postalCode}, ${city}, ${province}, ${country}</li>
            <li><strong>DNI/NIE/CIF:</strong> ${dni}</li>
          </ul>
        </div>

        <div style="${cardStyles}">
          <h3 style="${titleStyles}">Información del formulario</h3>
          <ul style="padding-left: 20px; margin: 0;">
            <li><strong>Razón de acudir a terapia:</strong> ${reason}</li>
            <li><strong>Cómo te sientes:</strong> ${feeling}</li>
            <li><strong>Tiempo con esta sensación:</strong> ${timeFeeling}</li>
            <li><strong>Terapias anteriores:</strong> ${previousTherapy}</li>
            <li><strong>Día disponible:</strong> ${availability}</li>
          </ul>
        </div>

        <p style="margin-top: 20px;">Nos pondremos en contacto contigo pronto para agendar tu primera sesión gratuita.</p>
        <p>Gracias por confiar en nosotros.<br><strong>El equipo de Cora Mind</strong></p>

        <div style="text-align: center; margin-top: 40px; font-size: 14px; color: #666;">
          <p>© ${new Date().getFullYear()} Cora Mind. Todos los derechos reservados.</p>
        </div>
      </div>
      `,
    };

    // === Correo al administrador ===
    const adminMailOptions = {
      from: `"Cora Mind" <${process.env.SMTP_USER}>`,
      to: "coramind.newvalue@gmail.com",
      subject: `Nueva solicitud de primera consulta gratuita - ${firstName} ${firstLastName}`,
      html: `
      <div style="${emailStyles}">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="https://res.cloudinary.com/dkm0ahny1/image/upload/v1762168143/coramind-logo-email_aiwngo.png" alt="Cora Mind" width="140" style="margin-bottom: 10px;" />
          <h2 style="color: ${brandColor}; margin-top: 10px;">Nueva solicitud de consulta</h2>
        </div>

        <p>Un nuevo usuario ha completado el formulario de registro solicitando una <strong>primera consulta gratuita</strong>.</p>

        <div style="${cardStyles}">
          <h3 style="${titleStyles}">Datos del paciente</h3>
          <ul style="padding-left: 20px; margin: 0;">
            <li><strong>Nombre completo:</strong> ${firstName} ${firstLastName} ${secondLastName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Teléfono:</strong> ${phone}</li>
            <li><strong>Dirección:</strong> ${address}, ${postalCode}, ${city}, ${province}, ${country}</li>
            <li><strong>DNI/NIE/CIF:</strong> ${dni}</li>
          </ul>
        </div>

        <div style="${cardStyles}">
          <h3 style="${titleStyles}">Motivo de contacto</h3>
          <ul style="padding-left: 20px; margin: 0;">
            <li><strong>Razón de acudir a terapia:</strong> ${reason}</li>
            <li><strong>Cómo se siente:</strong> ${feeling}</li>
            <li><strong>Tiempo con esta sensación:</strong> ${timeFeeling}</li>
            <li><strong>Terapias anteriores:</strong> ${previousTherapy}</li>
            <li><strong>Día disponible:</strong> ${availability}</li>
          </ul>
        </div>

        <p style="margin-top: 20px;">Por favor, revisa esta solicitud y contacta con el paciente para coordinar la cita inicial.</p>

        <div style="text-align: center; margin-top: 40px; font-size: 14px; color: #666;">
          <p>© ${new Date().getFullYear()} Cora Mind. Sistema de gestión de pacientes</p>
        </div>
      </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    res.status(201).json({ message: "Usuario creado y correos enviados correctamente", user: newUser });
  } catch (error) {
    console.error("Error en createUserAndSendEmail:", error);
    res.status(500).json({ message: "Error creando usuario o enviando correos", error: error.message });
  }
};
