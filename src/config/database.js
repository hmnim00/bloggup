const mongoose = require("mongoose");

mongoose
  .connect(`${process.env.MONGODB_URL}`, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => console.log(`DB Connected`))
  .catch((err) => console.log(err));
