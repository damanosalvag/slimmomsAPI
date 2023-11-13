const Products = require("../schemas/products");
const { filterProducts } = require("./filters");

const listProducts = async (typeBlood, query) => {
  try {
    const healthyProducts = (await Products.find({
      [`groupBloodNotAllowed.${typeBlood}`]: false,
    })) || {
      message: "products, no found",
    };
    console.log(query);
    const data = healthyProducts.filter((product) =>
      product.title.includes(query)
    );
    return data;
  } catch (error) {
    console.error("database error:", error);
  }
};

const getUnhealthyList = async (typeBlood, query) => {
  const findProducts = (await Products.find({
    [`groupBloodNotAllowed.${typeBlood}`]: true,
  })) || {
    message: "products, no found",
  };
  const listProductsUnHealthy = filterProducts(findProducts, query);
  return listProductsUnHealthy;
};


module.exports = {
  listProducts,
  getUnhealthyList,
};
