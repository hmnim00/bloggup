const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// Función de autenticación de usuarios
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passReqToCallback: true
}, async (req, username, password, done) => {

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return done(null, false, req.flash('signinMessage', 'Username or password are invalid'));
    } else {
      const match = await user.matchPassword(password);
      if (match) {
        return done(null, user);
      } else {
        return done(null, false, req.flash('signinMessage', 'Username or password are invalid'));
      }
    }
  } catch (error) {
    console.log('Error => ', error);
  }
}));

// funcion de registro de usuarios
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const { fullname } = req.body;

  const user = new User({
    fullname,
    username,
    password
  });

  const checkUsername = await User.findOne({ username });
  if (checkUsername) {
    return done(null, false);
  }
  try {
    user.password = await user.encryptPassword(password);
    await user.save();
    console.log(user);
    return done(null, user);
  } catch (error) {
    console.log(error);
  }

}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});