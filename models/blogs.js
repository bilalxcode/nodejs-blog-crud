const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  {
    collection: "blog", 
  }
);


module.exports = mongoose.model("Blog", blogSchema);
