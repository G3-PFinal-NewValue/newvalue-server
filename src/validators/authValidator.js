import { body } from 'express-validator';

export const registerValidator = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un correo electrónico válido'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('first_name')
        .notEmpty()
        .withMessage('El nombre es obligatorio'),
];

export const loginValidator = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un correo electrónico válido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),
];
