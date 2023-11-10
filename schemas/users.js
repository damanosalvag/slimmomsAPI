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
    default: 1,
  },
  height: {
    type: Number,
    default: 170,
  },
  age: {
    type: Number,
    default: 30,
  },
  weightCurrent: {
    type: Number,
    default: 100,
  },
  weightDesired: {
    type: Number,
    default: 70,
  },
  dailyRate: {
    type: Number,
    default: 2000,
  },
  notAllowedProducts: [String],
  token: {
    type: String,
    default: null,
  },
  summaryId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  isLoggedIn: {
    type: Boolean,
    default: true,
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
