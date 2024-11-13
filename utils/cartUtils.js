// utils/cartUtils.js
import {batch} from 'react-redux';
import {clearCart, setCartData, setMember} from '../redux/slices/cart';
import {deteleOrderCart} from '../utils/createCart';

export const clearCartData = (
  dispatch,
  setVisible,
  setOrderedProduct,
  orderedProduct,
  shopId,
) => {
  deteleOrderCart(orderedProduct?.id);
  setVisible(false);
  setOrderedProduct(null);
  batch(() => {
    dispatch(clearCart(shopId));
    dispatch(setMember({}));
    dispatch(setCartData({}));
  });
};
