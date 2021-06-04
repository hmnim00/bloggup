const { Router } = require('express');

const articleRoutes = require('./article.routes');
const authRoutes = require('./user.routes');
const commentRoutes = require('./comment.routes');

const Article = require('../models/article');
const User = require('../models/user');

const router = Router();

// Home routes
router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ created: -1 }).lean().populate(['user', 'comments']);
  // console.log('Articles => ', articles);
  const totalArticles = articles.length;
  const users = await User.find().lean();
  const totalUsers = users.length;
  const title = 'Home';
  res.render('index', { articles, totalArticles, totalUsers, title });
});

router.use('/article', articleRoutes);
router.use('/auth', authRoutes);
router.use('/comment', commentRoutes);

module.exports = router;