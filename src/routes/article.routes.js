const { Router } = require('express');
const Article = require('../models/article');
const Comment = require('../models/comment');
const { isAuthenticated } = require('../libs/helpers');
const timeago = require('timeago.js');
const validations = require('../libs/validate');
const { validationResult, matchedData } = require('express-validator');

const router = Router();

router.get('/add', isAuthenticated, (req, res) => {
  const title = 'Create article';
  res.render('create', { article: new Article(), title });
});

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug }).lean().populate('user');
  const comments = await Comment.find({ article: article._id }).sort({ created: -1 }).lean().populate('user');
  const totalComments = comments.length;
  const title = article.title;
  if (article == null) res.redirect('/');
  res.render('article', { article, comments, timeago, title, totalComments });
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    await Article.findOneAndRemove(req.params.id);
  } catch (error) {
    console.log(`Article not found`);
  }

  res.redirect('/');
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
  const article = await Article.findById(req.params.id).lean();
  const title = 'Edit article';
  res.render('edit', { article, title });
});

router.put('/update/:id', isAuthenticated, async (req, res, next) => {
  req.article = await Article.findById(req.params.id);
  next();
}, saveArticleAndRedirect('edit'));

router.post('/create', isAuthenticated, validations.validateEntryForm, async (req, res, next) => {
  req.article = new Article();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var errMsg = errors.mapped();
    var inputData = matchedData(req);
    const title = 'Create article';
    res.render('create', { errors: errMsg, inputData: inputData, title });
  } else {
    next();
  }
}, saveArticleAndRedirect('add'));

// save article
function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown
    article.user = res.locals.user._id

    try {
      article = await article.save();
      res.redirect(`/article/${article.slug}`);
    } catch (error) {
      res.render(`/article/${path}`, { article });
      console.log(error);
    }
  };
};

module.exports = router;