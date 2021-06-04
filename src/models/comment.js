const mongoose = require('mongoose');
const schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  created: { type: Date, default: () => Date.now() },

  user: { type: schema.Types.ObjectId, ref: 'User' },
  article: { type: schema.Types.ObjectId, ref: 'Article' }
});

module.exports = mongoose.model('Comment', commentSchema);