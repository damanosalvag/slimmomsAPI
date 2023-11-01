
const pagination = (productsLength, page, limit) => {
  let pagValues = {};
  const pages = limit > productsLength ? 1 : Math.ceil(productsLength / limit);
  if (page > pages) {
    const li = (pages - 1) * limit;
    const ls = productsLength + 1;
    pagValues = {
      pages,
      limitInf: li,
      limitSup: ls,
    };
  } else {
    const limitSup =
      page * limit > productsLength ? productsLength : page * limit;
    const limitInf = limit >= limitSup ? 0 : limitSup - limit;
    pagValues = {
      pages,
      limitInf,
      limitSup,
    };
  }
  return pagValues;
};

const filterProducts = (list, {  page, limit }) => {
  const { pages, limitInf, limitSup } = pagination(
    list.length,
    page,
    limit
  );
  const ProductsGroup = list.slice(limitInf, limitSup);
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    pages,
    limitInf,
    limitSup,
    length: list.length,
    products: ProductsGroup,
  };
};

module.exports = {
  filterProducts,
};
