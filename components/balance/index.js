import { parseCookies } from "nookies";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";
import ShoppingBag3FillIcon from "remixicon-react/ShoppingBag3FillIcon";
import { DrawerConfig } from "../../configs/drawer-config";
import { MainContext } from "../../context/MainContext";
import { OrderContext } from "../../context/OrderContext";
import { getPrice } from "../../utils/getPrice";

const getBalanceClassNames = (displayPrice) => {
  const priceLength = displayPrice.toString().length;
  const classNames = ["balance"];
  if (priceLength > 11) classNames.push("balance--md");
  if (priceLength > 16) classNames.push("balance--sm");
  if (priceLength > 20) classNames.push("balance--xs");

  return classNames.join(" ");
};

function Balance() {
  const dc = DrawerConfig;
  const cookies = parseCookies();
  const { handleVisible, handleAuth } = useContext(MainContext);
  const { cartLoader, orderedProduct } = useContext(OrderContext);

  const displayPrice = getPrice(orderedProduct?.total_price);
  const onClick = () => {
    if (cookies.access_token || cookies.cart_id) handleVisible(dc.order_list);
    else {
      toast.error("Please login first");
      handleAuth("login");
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
