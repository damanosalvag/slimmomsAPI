const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  name: { type: String, required: [true, "Name is required"], default: "User" },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  blood: {
    type: Number,
    default: null,
  },
  height: {
    type: Number,
    default: null,
  },
  age: {
    type: Number,
    default: null,
  },
  weight_current: {
    type: Number,
    default: null,
  },
  weight_desired: {
    type: Number,
    default: null,
  },
  daily_rate: {
    type: Number,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
});

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = model("Users", userSchema);

module.exports = User;
