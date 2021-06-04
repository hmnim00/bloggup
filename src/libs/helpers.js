const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  // verifica que el usuario esté logueado
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/signin');
};

module.exports = helpers;