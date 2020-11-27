export const formatDate = (date) => {
  return `${date.slice(0, 10)} ${date.slice(11, 19)}`;
};

export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const validateProduct = (product, minCountInStockOne = false) => {
  let valid =
    product.name !== "Sample name" &&
    product.image !== "/images/sample.jpg" &&
    product.brand !== "Sample brand" &&
    product.category !== "Sample category" &&
    product.description !== "Sample description" &&
    product.image !== "/images/sample.jpg" &&
    product.price !== 0;
  valid = minCountInStockOne && product.countInStock === 0 ? false : valid;

  return valid;
};
