const express = require("express");

const path = require("path");

const bodyParser = require("body-parser");
const multer = require("multer");

const blogRoutes = require("./routes/blog-routes");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const mongoose = require("mongoose");
const Blog = require("./models/blogs");
const userDb = require("./models/userSchema");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images"));
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    cb(null, timestamp + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
mongoose.connect(
  "mongodb+srv://supremebilal78:t5OxJKSK26h9q9YU@test-db.v6p1fbj.mongodb.net/?retryWrites=true&w=majority"
);

const app = express();
const store = new MongoDbStore({
  uri: "mongodb+srv://supremebilal78:t5OxJKSK26h9q9YU@test-db.v6p1fbj.mongodb.net/?retryWrites=true&w=majority",
  collection: "sessions",
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "assets")));

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/", blogRoutes);
app.use(blogRoutes);
app.listen(3000, function () {
  console.log("Server running");
});
