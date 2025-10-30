import express from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import { sendUserConfirmation } from "../services/emailService.js";

const router = express.Router();

router.post("/first-session", async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const password_hash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      email,
      password_hash,
      first_name: firstName,
      last_name: lastName,
      phone,
      role_id: 3, // paciente
    });

    await sendUserConfirmation(user);

    res.status(201).json({ message: "Usuario creado y correo enviado", user });
  } catch (error) {
    console.error("Error en /first-session:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
});

export default router;
