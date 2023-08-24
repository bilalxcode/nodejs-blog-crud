const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
  },
  {
    collection: "user",
  }
);

module.exports = mongoose.model("User", userSchema);
