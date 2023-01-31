const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
const app = express();
const cors = require('cors');
dotenv.config();

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const bookRoute = require('./routes/book');
const postRoute = require("./routes/post");
const uploadRoute = require("./routes/upload");

app.use(express.json());
app.use(cors());
app.use('/images', express.static(__dirname + '/images'));
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('connected');
  })
  .catch((error) => {
    console.log(error); 
  });

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/books', bookRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});