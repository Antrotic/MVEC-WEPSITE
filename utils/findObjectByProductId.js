export const findObjectByProductId = (data, productId) => {
  for (const item of data) {
    for (const cartDetail of item.cartDetails) {
      if (cartDetail.shopProduct.id === productId) {
        return item?.uuid;
      }
    }
  }
  return null;
};
