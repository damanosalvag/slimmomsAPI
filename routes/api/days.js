const express = require("express");
// const Joi = require("joi");
const auth = require("../../config/auth.js");

const { addProduct } = require("../../controllers/days.js");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    console.log(req.user);
    const contact = await addProduct(req.body, req.user._id);
    res.status(201).json(contact);
  } catch (error) {
    console.error("Error en la ruta /:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
