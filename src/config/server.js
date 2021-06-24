const express = require("express");
const path = require("path");
const morgan = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const dotenv = require("dotenv");

dotenv.config();

require("./database");
require("../libs/passport");

module.exports = (app) => {
  // ajustes
  app.set("port", process.env.PORT || 3000);
  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "ejs");

  // middlewares
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride("_method"));
  app.use(
    session({
      secret: "hmnim_appscrt",
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.json());
  app.use(flash());

  // rutas globales
  app.use((req, res, next) => {
    app.locals.signinMessage = req.flash("signinMessage");
    res.locals.user = req.user || null; // usuario logueado o no
    next();
  });

  // rutas
  app.use(require("../routes/index.routes"));

  // archivos públicos
  app.use("/public", express.static(path.join(__dirname, "../public")));

  return app;
};
