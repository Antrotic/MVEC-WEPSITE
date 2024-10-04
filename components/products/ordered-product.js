import React, { useContext, useMemo, useCallback } from "react";
import AddFillIcon from "remixicon-react/AddFillIcon";
import SubtractFillIcon from "remixicon-react/SubtractFillIcon";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { getImage } from "../../utils/getImage";
import { getPrice } from "../../utils/getPrice";
import { OrderContext } from "../../context/OrderContext";
import { deleteOrderProduct } from "../../utils/createCart";
import { getTotals, removeFromCart } from "../../redux/slices/cart";
import { parseCookies } from "nookies";

const OrderedProduct = ({ data, isEdit, shop, element }) => {
  const isGiftCard = data?.product?.gift;
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const cart = useSelector((state) => state.cart, shallowEqual);
  const { decrease, increase, getCart, getCartMember } =
    useContext(OrderContext);

  const currentProduct = useMemo(
    () =>
      cart.cartItems.find(
        (item) =>
          item?.id === data?.id &&
          item.user_cart_uuid === element.user_cart_uuid
      ),
    [cart.cartItems, data?.id]
  );

  const deleteProduct = useCallback(() => {
    deleteOrderProduct(element.id);
    if (cookies.cart_id) getCartMember();
    else getCart();
    batch(() => {
      dispatch(
        removeFromCart({ ...data, user_cart_uuid: element.user_cart_uuid })
      );
      dispatch(getTotals(shop.id));
    });
  }, [
    cookies.cart_id,
    data,
    dispatch,
    element.id,
    getCart,
    getCartMember,
    shop.id,
  ]);

  const countText = useMemo(
    () => getCount(data, currentProduct, element),
    [data, currentProduct, element]
  );
  return (
    <div className='ordered-product'>
      <div className='product-img'>
        {getImage(data.product?.img)}
        {!isEdit && (
          <div className='delete' onClick={deleteProduct}>
            <DeleteBinLineIcon />
          </div>
        )}
      </div>
      <div className='content'>
        <div className='name'>{data.product?.translation?.title}</div>
        <div className='counter'>
          <div className='total-price'>
            {data.discount
              ? getPrice(data.price - data.discount)
              : getPrice(data.price)}
          </div>
          {!isGiftCard && (
            <div className='counter-btn'>
              <button
                disabled={isEdit}
                className='decrement'
                onClick={() =>
                  decrease({ ...data, user_cart_uuid: element.user_cart_uuid })
                }
              >
                <SubtractFillIcon />
              </button>
              <div className='count'>{countText}</div>
              <button
                disabled={isEdit}
                className='increment'
                onClick={() =>
                  increase({ ...data, user_cart_uuid: element.user_cart_uuid })
                }
              >
                <AddFillIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function getCount(data, currentProduct, element) {
  return `${
    currentProduct?.qty
      ? currentProduct?.qty
      : element?.quantity
      ? element?.quantity
      : 0
  } ${data?.product?.unit ? data?.product.unit?.translation?.title : ""}`;
}

export default OrderedProduct;
