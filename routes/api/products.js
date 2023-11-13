const express = require("express");
// const Joi = require("joi");
const auth = require("../../config/auth.js");

const {
  listProducts,
  getUnhealthyList,
} = require("../../controllers/products.js");
const { calculatorPublic } = require("../../controllers/calculator.js");

const router = express.Router();

// route to search and add products
router.get("/products", auth, async (req, res) => {
  try {
    const query = req.query.search;
    const products = await listProducts(req.user.blood, query);
    res.json(products);
  } catch (error) {
    console.error("Error in route /:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});
router.get("products/unhealthy", auth, async (req, res) => {
  try {
    const notHealtyList = await getUnhealthyList(req.user.blood, req.query);
    res.json(notHealtyList);
  } catch (error) {
    console.error("Error en la ruta /:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});
router.post("/calculator", async (req, res) => {
  try {
    const result = await calculatorPublic(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid data" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
