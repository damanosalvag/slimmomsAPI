const Days = require("../schemas/products");
const Summary = require("../schemas/summary");

const addProduct = async (body, user_id) => {
  try {
    const data = await Days.find(query);
    return data;
  } catch (error) {
    console.error("database error:", error);
  }
};

module.exports = {
  addProduct,
};
