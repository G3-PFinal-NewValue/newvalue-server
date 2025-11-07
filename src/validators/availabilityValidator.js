import { body } from 'express-validator';

//  Validador para crear disponibilidad específica (calendario)
export const createSpecificAvailabilityValidator = [
  body('psychologist_id')
    .isInt()
    .withMessage('psychologist_id debe ser un entero'), // Validar que sea ID de psicólogo válido

  body('specific_date')
    .isDate()
    .withMessage('specific_date debe ser una fecha válida (YYYY-MM-DD)'), // Validar formato de fecha

  body('start_time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('start_time debe tener formato HH:MM'), // Validar formato de hora

  body('end_time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('end_time debe tener formato HH:MM'), // Validar formato de hora

  body('is_available')
    .isBoolean()
    .withMessage('is_available debe ser booleano (true/false)'), // Validar que sea boolean

  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('notes no puede exceder 500 caracteres'), // Validar longitud de notas

  //  Validación personalizada para verificar que end_time > start_time
  body('end_time').custom((value, { req }) => {
    if (value <= req.body.start_time) {
      throw new Error('end_time debe ser posterior a start_time');
    }
    return true;
  })
];

//  Validador para actualizar disponibilidad específica
export const updateSpecificAvailabilityValidator = [
  body('specific_date')
    .optional()
    .isDate()
    .withMessage('specific_date debe ser una fecha válida (YYYY-MM-DD)'),

  body('start_time')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('start_time debe tener formato HH:MM'),

  body('end_time')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('end_time debe tener formato HH:MM'),

  body('is_available')
    .optional()
    .isBoolean()
    .withMessage('is_available debe ser booleano (true/false)'),

  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('notes no puede exceder 500 caracteres')
];


export const createAvailabilityValidator = [
  body('psychologist_id')
    .isInt()
    .withMessage('psychologist_id debe ser un entero'),

  body('weekday')
    .optional() //  Ahora opcional
    .isInt({ min: 1, max: 7 })
    .withMessage('weekday debe ser un entero entre 1 y 7'),

  body('start_time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('start_time debe tener formato HH:MM'),

  body('end_time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('end_time debe tener formato HH:MM')
];
