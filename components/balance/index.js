import {parseCookies} from 'nookies';
import React, {useContext, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {Spinner} from 'reactstrap';
import ShoppingBag3FillIcon from 'remixicon-react/ShoppingBag3FillIcon';
import {DrawerConfig} from '../../configs/drawer-config';
import {MainContext} from '../../context/MainContext';
import {OrderContext} from '../../context/OrderContext';
import {getPrice} from '../../utils/getPrice';
import {calculateGuestCartTotal, getGuestCart} from '../../utils/guestCart';

const getBalanceClassNames = displayPrice => {
  const priceLength = displayPrice.toString().length;
  const classNames = ['balance'];
  if (priceLength > 11) classNames.push('balance--md');
  if (priceLength > 16) classNames.push('balance--sm');
  if (priceLength > 20) classNames.push('balance--xs');

  return classNames.join(' ');
};

function Balance() {
  const dc = DrawerConfig;
  const cookies = parseCookies();
  const {handleVisible, handleAuth} = useContext(MainContext);
  const {cartLoader, orderedProduct} = useContext(OrderContext);
  const [guestTotal, setGuestTotal] = useState(0);

  // Update guest cart total when component mounts or cart changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !cookies.access_token && !cookies.cart_id) {
      const total = calculateGuestCartTotal();
      setGuestTotal(total);
    }
  }, [cookies.access_token, cookies.cart_id]);

  const displayPrice = cookies.access_token || cookies.cart_id
    ? getPrice(orderedProduct?.total_price)
    : getPrice(guestTotal);

  const onClick = () => {
    // Allow viewing cart for both guest and logged-in users
    if (cookies.access_token || cookies.cart_id) {
      handleVisible(dc.order_list);
    } else {
      // Check if guest cart has items
      const guestCart = getGuestCart();
      if (guestCart.length > 0) {
        handleVisible(dc.order_list);
      } else {
        toast.error('Your cart is empty');
      }
    }
  };

  return (
    <div className={getBalanceClassNames(displayPrice)} onClick={onClick}>
      <div className="icon">
        {cartLoader ? (
          <Spinner color="light" size="sm" />
        ) : (
          <ShoppingBag3FillIcon size={20} />
        )}
      </div>
      {!Boolean(cartLoader) && <div className="amount">{displayPrice}</div>}
    </div>
  );
}

export default Balance;
