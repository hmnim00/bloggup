const User = require('../models/user');

const { check } = require('express-validator');
const validations = {};

// validación de registro de usuarios
validations.validateSignup = [
  check('fullname').trim().notEmpty().withMessage('Full name is required')
    .matches(/^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$/).withMessage('Only characters with space are allowed'),
  check('username').trim().notEmpty().withMessage('Username is required')
    .matches(/^[a-zA-Z]*$/).not().matches(/^$|\s+/).withMessage('White space not allowed')
    .custom(value => {
      return User.findOne({ username: value }).then((username) => {
        if (username) {
          throw new Error('Username is already taken');
        }
      })
    }),
  check('password').trim().notEmpty().withMessage('Password is required')
    .isLength({ min: 5 }).withMessage('Password must be minimum 5 length').matches(/^[a-zA-Z0-9]*$/).not().matches(/^$|\s+/).withMessage('White space not allowed'),
  check('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })
]

// validación de autenticación
validations.validateSignin = [
  check('username').trim().notEmpty().withMessage('Username is required')
    .matches(/^[a-zA-Z]*$/).not().matches(/^$|\s+/).withMessage('White space not allowed'),
  check('password').trim().notEmpty().withMessage('Password is required')
]

// validación de creación de artículo
validations.validateEntryForm = [
  check('title').trim().notEmpty().withMessage('Title is required'),
  check('description').trim().notEmpty().withMessage('Description is required'),
  check('markdown').trim().notEmpty().withMessage('Markdown content is required')
]

// validación de comentario
validations.validateComment = [
  check('comment').trim().notEmpty().withMessage('Cannot send an empty message'),
]

module.exports = validations;