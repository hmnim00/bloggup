const User = require("../models/user");

const { check } = require("express-validator");
const validations = {};

// validación de registro de usuarios
validations.validateSignup = [
  check("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .matches(/^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$/)
    .withMessage("Solo caracteres con espacio"),
  check("username")
    .trim()
    .notEmpty()
    .withMessage("Este campo es requerido")
    .matches(/^[a-zA-Z]*$/)
    .not()
    .matches(/^$|\s+/)
    .withMessage("No se permiten espacios")
    .custom((value) => {
      return User.findOne({ username: value }).then((username) => {
        if (username) {
          throw new Error("El nombre de usuario no está disponible");
        }
      });
    }),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Este campo es requerido")
    .isLength({ min: 5 })
    .withMessage("La contraseña debe contener al menos 5 caracteres")
    .matches(/^[a-zA-Z0-9]*$/)
    .not()
    .matches(/^$|\s+/)
    .withMessage("No se permiten espacios"),
  check("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas deben coincidir");
    }
    return true;
  }),
];

// validación de autenticación
validations.validateSignin = [
  check("username")
    .trim()
    .notEmpty()
    .withMessage("Este campo es requerido")
    .matches(/^[a-zA-Z]*$/)
    .not()
    .matches(/^$|\s+/)
    .withMessage("No se permiten espacios"),
  check("password").trim().notEmpty().withMessage("Este campo es requerido"),
];

// validación de creación de artículo
validations.validateEntryForm = [
  check("title").trim().notEmpty().withMessage("Este campo es requerido"),
  check("description").trim().notEmpty().withMessage("Este campo es requerido"),
  check("markdown").trim().notEmpty().withMessage("Este campo es requerido"),
];

// validación de comentario
validations.validateComment = [
  check("comment").trim().notEmpty().withMessage("Este campo es requerido"),
];

module.exports = validations;
