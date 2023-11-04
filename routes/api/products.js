const express = require("express");
// const Joi = require("joi");
const auth = require("../../config/auth.js");

const {
  listProducts,
  getUnhealthyList,
} = require("../../controllers/products.js");
const { calculatorPublic } = require("../../controllers/calculator.js");

const router = express.Router();

// const schema = Joi.object({
//   name: Joi.string().min(3).max(30).required(),
//   email: Joi.string().email().required(),
//   phone: Joi.number().integer().min(1000000000).max(9999999999).required(),
//   favorite: Joi.boolean(),
// });
// const schemaStatus = Joi.object({
//   favorite: Joi.boolean().required(),
// });

// const validateBody = async (req, res, next) => {
//   try {
//     await schema.validateAsync(req.body);
//     next();
//   } catch (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }
// };
// const validateFavoriteField = async (req, res, next) => {
//   try {
//     await schemaStatus.validateAsync({ favorite: req.body.favorite });
//     next();
//   } catch (error) {
//     return res.status(400).json({
//       error: error.details[0].message,
//       message: "missing field favorite",
//     });
//   }
// };

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

// router.get("/:contactId", auth, async (req, res) => {
//   try {
//     const id = req.params.contactId;
//     const contact = await getContactById(id, req.user._id);
//     res.json(contact);
//   } catch (error) {
//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid contact ID" });
//     }
//     res
//       .status(500)
//       .json({ error: `Server error type: ${error.name}` });
//   }
// });

// router.post("/", auth, validateBody, async (req, res) => {
//   try {
//     console.log(req.user);
//     const contact = await addContact(req.body, req.user._id);
//     res.status(201).json(contact);
//   } catch (error) {
//     console.error("Error en la ruta /:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// router.delete("/:contactId", auth, async (req, res) => {
//   try {
//     const id = req.params.contactId;
//     const contact = await removeContact(id, req.user._id);
//     res.json(contact);
//   } catch (error) {
//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid contact ID" });
//     }
//     res.status(500).json({ error: "Server error" });
//   }
// });

// router.put("/:contactId", auth, validateBody, async (req, res) => {
//   const id = req.params.contactId;
//   try {
//     const contact = await updateContact(id, req.body, req.user._id);
//     res.status(201).json(contact);
//   } catch (error) {
//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid contact ID" });
//     }
//     res.status(500).json({ error: "Server errorr" });
//   }
// });
// router.patch(
//   "/:contactId/favorite",
//   auth,
//   validateFavoriteField,
//   async (req, res) => {
//     const id = req.params.contactId;
//     try {
//       const contact = await updateStatusContact(id, req.body, req.user._id);
//       res.status(201).json(contact);
//     } catch (error) {
//       if (error.name === "CastError") {
//         return res.status(400).json({ message: "Invalid contact ID" });
//       }
//       res.status(500).json({ error: "Server error" });
//     }
//   }
// );
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
