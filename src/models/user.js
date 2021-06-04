const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joined: { type: Date, default: () => Date.now() },

  articles: [{type: schema.Types.ObjectId, ref: 'Article'}],
  comments: [{type: schema.Types.ObjectId, ref: 'Comment'}]
});

// Hash password
userSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// Match password
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.pre('remove', function(next) {
  Article.remove({user: this._id}).exec();
  Comment.remove({user: this._id}).exec();
  next();
});

module.exports = mongoose.model('User', userSchema);