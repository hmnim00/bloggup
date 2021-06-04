const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);
const schema = mongoose.Schema;

const Comment = require('./comment');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  markdown: { type: String, required: true },
  created: { type: Date, default: () => Date.now() },
  slug: { type: String, required: true, unique: true },
  sanitizedHTML: { type: String, required: true },
  views: { type: Number, default: 0 },

  user: { type: schema.Types.ObjectId, ref: 'User' },
  comments: [{type: schema.Types.ObjectId, ref: 'Comment'}]
});

articleSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.markdown) {
    this.sanitizedHTML = dompurify.sanitize(marked(this.markdown));
  }
  next();
});

articleSchema.pre('remove', function (next) {
  Comment.remove({article: this._id}).exec();
  next();
});

module.exports = mongoose.model('Article', articleSchema);