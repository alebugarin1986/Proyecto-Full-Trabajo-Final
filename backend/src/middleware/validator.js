const { validationResult, body } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

const userValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/).withMessage('La contraseña debe tener al menos una letra mayúscula')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe tener al menos un símbolo'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
  ];
};

const resetPasswordValidationRules = () => {
  return [
    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/).withMessage('La contraseña debe tener al menos una letra mayúscula')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe tener al menos un símbolo'),
  ];
};

const bookValidationRules = () => {
  return [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('author').notEmpty().withMessage('El autor es obligatorio'),
    body('categories').isArray({ min: 1 }).withMessage('Debes seleccionar al menos un género'),
    body('categories.*').isMongoId().withMessage('ID de género inválido'),
  ];
};

const reviewValidationRules = () => {
  return [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('La calificación debe estar entre 1 y 5'),
    body('comment').notEmpty().withMessage('El comentario no puede estar vacío'),
  ];
};

module.exports = {
  validate,
  userValidationRules,
  resetPasswordValidationRules,
  bookValidationRules,
  reviewValidationRules,
};
