const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    categories: {
      type: String,
    },
    weight: {
      type: Number,
    },
    title: {
      type: String,
    },
    calories: {
      type: Number,
    },
    groupBloodNotAllowed: [Boolean],
  },
  { versionKey: false, timestamps: true }
);
const ProductSchema = model("Product", productSchema);

module.exports = ProductSchema;
