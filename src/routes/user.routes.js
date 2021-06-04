const { Router } = require('express');
const passport = require('passport');
const Article = require('../models/article');
const validations = require('../libs/validate');
const { validationResult, matchedData } = require('express-validator');
const comment = require('../models/comment');

const router = Router();

router.get('/profile', async (req, res) => {
  console.log('User id: ', res.locals.user.id);
  const articles = await Article.find({ user: res.locals.user.id }).sort({ created: -1 }).lean();
  const comments = await comment.find({ user: res.locals.user.id });
  const totalComments = comments.length;
  const totalArticles = articles.length;
  const title = res.locals.user.username;
  res.render('auth/profile', { articles, totalComments, totalArticles, title });
});

router.get('/signin', async (req, res) => {
  const title = 'Sign In';
  res.render('auth/signin', { title });
});

router.get('/signup', async (req, res) => {
  const title = 'Sign Up';
  res.render('auth/signup', { title });
});

router.post('/signup', validations.validateSignup, (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var errMsg = errors.mapped();
    var inputData = matchedData(req);
    const title = 'Sign Up';
    res.render('auth/signup', { errors: errMsg, inputData: inputData, title });
  } else {
    next();
  }

}, passport.authenticate('local.signup', {
  successRedirect: '/auth/profile',
  failureRedirect: '/auth/signup'
}));

router.post('/signin', validations.validateSignin, (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var errMsg = errors.mapped();
    var inputData = matchedData(req);
    const title = 'Sign In';
    res.render('auth/signin', { errors: errMsg, inputData: inputData, title });
  } else {
    next();
  }


}, passport.authenticate('local.signin', {
  successRedirect: '/auth/profile',
  failureRedirect: '/auth/signin'
}));

router.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/');
});


module.exports = router;