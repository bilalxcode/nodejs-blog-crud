const express = require("express");

const path = require("path");

const bodyParser = require("body-parser");

const blogRoutes = require("./routes/blog-routes");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/", blogRoutes);
app.get("/new-post", blogRoutes);
app.post("/new-post", blogRoutes);
app.use("/delete-post", blogRoutes);
app.post("/edit-post", blogRoutes);

app.listen(3000);
