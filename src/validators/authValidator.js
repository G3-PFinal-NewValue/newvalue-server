import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail().withMessage("Debe ser un correo electrónico válido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("first_name").notEmpty().withMessage("El nombre es obligatorio"),
  body("last_name").notEmpty().withMessage("El apellido es obligatorio"),
  body("phone").notEmpty().withMessage("El teléfono es obligatorio"),
  body("postal_code").notEmpty().withMessage("El código postal es obligatorio"),
  body("province").notEmpty().withMessage("La provincia es obligatoria"),
  body("full_address").notEmpty().withMessage("La dirección es obligatoria"),
  body("city").notEmpty().withMessage("La ciudad es obligatoria"),
  body("country").notEmpty().withMessage("El país es obligatorio"),
  body("dni_nie_cif").notEmpty().withMessage("El DNI/NIE/CIF es obligatorio"),
  body("role")
    .optional() // El rol es opcional, ya que el controlador asigna 'patient' por defecto
    .isIn(["patient", "psychologist", "admin"])
    .withMessage('El rol debe ser "patient" o "psychologist"'),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Debe ser un correo electrónico válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];
