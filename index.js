// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();
require("dotenv").config();
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
});

const Url = mongoose.model("Url", urlSchema);
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});
//connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// your first API endpoint...
app.get("/api/shorturl", function (req, res) {
  console.log(req.body);
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
