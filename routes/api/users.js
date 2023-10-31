const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const auth = require("../../config/auth.js");
require("../../config/config-passport.js");
const { calculator, notHealty } = require("../../models/calculator.js");

const User = require("../../schemas/users.js");

const router = express.Router();

const schemaSignUp = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/)
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const validateEmailPassword = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    await schemaSignUp.validateAsync({
      name,
      email,
      password,
      confirmPassword,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      error: error.details[0].message,
      message:
        "Require a valid email and password-min 8 characters, max 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character @#$%^&+=!",
    });
  }
};

router.post("/signup", validateEmailPassword, async (req, res) => {
  const { name, email, password } = req.body;
  console.log("body", req.body);
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  try {
    const newUser = new User({ name, email });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      user: {
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Error en la ruta /:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.checkPassword(password)) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const {
    name,
    blood,
    height,
    age,
    weight_current,
    weight_desired,
    daily_rate,
  } = user;
  const token = jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: "1d",
  });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      name,
      email,
      blood,
      height,
      age,
      weight_current,
      weight_desired,
      daily_rate,
    },
  });
});

// router.get("/logout", auth, async (req, res) => {
//   const { _id } = req.user;
//   try {
//     const response = await User.updateOne({ _id }, { token: null });
//     if (response.acknowledged) {
//       if (response.modifiedCount === 0) {
//         return res.json({ message: "The user has been loggead out" });
//       } else {
//         console.log("user logout");
//         return res.status(204).end();
//       }
//     }
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });

router.get("/current", auth, async (req, res, next) => {
  const {
    email,
    name,
    blood,
    height,
    age,
    weight_current,
    weight_desired,
    daily_rate,
  } = req.user;
  res.status(200).json({
    email,
    name,
    blood,
    height,
    age,
    weight_current,
    weight_desired,
    daily_rate,
  });
  // next();
});
router.patch("/calculator", auth, async (req, res) => {
  try {
    const result = await calculator(req.body, req.user._id);
    res.status(201).json(result);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid contact ID" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
