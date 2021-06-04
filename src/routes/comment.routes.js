const { Router } = require('express');
const Comment = require('../models/comment');
const Article = require('../models/article');

const { isAuthenticated } = require('../libs/helpers');

const router = Router();

router.get('/', async (req, res) => {
  const comments = await Comment.find().sort({ created: -1 }).lean();
  res.send(comments);
});

router.post('/:id/add', isAuthenticated, async (req, res) => {

  const { id } = req.params;
  const { comment } = req.body;
  const userId = res.locals.user.id;

  let article;

  try {
    article = await Article.findById(id).lean();
  } catch (error) {
    console.log('Cannot find the article');
  }

  const newComment = new Comment();
  newComment.comment = comment;
  newComment.user = userId;
  newComment.article = id;

  try {
    await newComment.save();
    res.redirect(`/article/${article.slug}`);
  } catch (error) {
    res.render(`/article/${path}`, { article });
  }

});

router.delete('/:id', isAuthenticated, async (req, res) => {

  const { id } = req.params;

  let comment;

  try {
    comment = await Comment.findById(id).lean();
  } catch (error) {
    console.log(`Cannot find the comment`);
  }

  const article = await Article.findById(comment.article);

  await Comment.findByIdAndDelete(id);
  res.redirect(`/article/${article.slug}`);

});

module.exports = router;