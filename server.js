const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.use(require("./routes/api.js"));

mongoose.Promise = global.Promise;

mongoose.connect (
  process.env.MONGODB_URI || "mongodb://User2:password1@ds237717.mlab.com:37717/heroku_lz2th0lz",
  {
    useMongoClient: true
  }
);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});