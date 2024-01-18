const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  phoneverified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "",
  },
  emailverified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", UserModel);

module.exports = User;
