import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import CheckoutStep from "./component/checkout-step";
import { ShopApi } from "../../api/main/shops";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import TypeButtons from "./component/type-buttons";
import { handleVisibleStoreInfo } from "../../redux/slices/mainState";
const DeliveryForm = dynamic(() => import("./component/delivery-form"));
const PickupForm = dynamic(() => import("./component/pickup-form"));

const Checkout = () => {
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const shop = useSelector((state) => state.stores.currentStore, shallowEqual);
  const [deliveryTypes, setDeliveryTypes] = useState(null);
  const [deliveryTab, setDeliveryTab] = useState("delivery");
  const deliveryPickup = deliveryTypes?.filter(
    (item) => item.type === "pickup"
  )[0];

  const getDelivery = () => {
    ShopApi.getDelivery({ [`shops[0]`]: shop.id })
      .then((res) => {
        setDeliveryTypes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDelivery();
    return () => {
      dispatch(handleVisibleStoreInfo(false));
    };
  }, []);

  return (
    <div className="checkout">
      <CheckoutStep name="checkout" />
      <div className="delivery-type">
        <div className="title">{tl("Delivery type")}</div>
        <TypeButtons
          deliveryTab={deliveryTab}
          deliveryTypes={deliveryTypes}
          setDeliveryTab={setDeliveryTab}
          deliveryPickup={deliveryPickup}
        />
        {deliveryTab === "delivery" ? (
          <DeliveryForm deliveryTypes={deliveryTypes} />
        ) : (
          <PickupForm deliveryPickup={deliveryPickup} />
        )}
      </div>
    </div>
  );
};

export default Checkout;
