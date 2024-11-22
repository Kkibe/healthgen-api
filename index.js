const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000; 
const hostname = '0.0.0.0';
const app = express();
const cors = require('cors'); 
dotenv.config();

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const bookRoute = require('./routes/book');
const postRoute = require("./routes/post");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
) 
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(cookieParser())
app.use('/api/images', express.static(__dirname + '/images'));
app.use('/api/files', express.static(__dirname + '/files'));
//app.use("/api/images", express.static("images"));
app.set("view engine", "ejs");
mongoose
  .set('strictQuery', false)
  .connect(process.env.MONGODB_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  });


app.get("/", (req, res) => {
  res.status(200).send("The server is up and running")
})

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/books', bookRoute);
app.use("/api/posts", postRoute);
app.listen(PORT,hostname);
