// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
const { URL } = require("url");

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

// your first API endpoint...
app.post("/api/shorturl", function (req, res) {
  const inputUrl = req.body.url;

  try {
    const urlObj = new URL(inputUrl); // Correct URL parsing

    dns.lookup(urlObj.hostname, async (err, address) => {
      if (err || !address) {
        res.json({ error: "invalid URL" });
      } else {
        const urlcount = await Url.countDocuments({});

        const result = await Url.create({
          originalUrl: inputUrl,
          shortUrl: urlcount,
        });

        console.log(result);
        res.json({
          original_url: inputUrl,
          short_url: urlcount,
        });
      }
    });
  } catch (err) {
    res.json({ error: "invalid URL" });
  }
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const shorturl = req.params.short_url;
  const urlDoc = await Url.findOne({ shortUrl: shorturl });
  res.redirect(urlDoc.originalUrl);
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
