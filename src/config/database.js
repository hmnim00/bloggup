const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bloggup', {
  useCreateIndex: true,
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
}).then(db => console.log(`DB Connected`)).catch(err => console.log(err));