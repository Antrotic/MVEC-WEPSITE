import React, { useContext, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import CalendarCheckLineIcon from "remixicon-react/CalendarCheckLineIcon";
import CheckboxBlankCircleLineIcon from "remixicon-react/CheckboxBlankCircleLineIcon";
import CheckboxCircleFillIcon from "remixicon-react/CheckboxCircleFillIcon";
import PencilFillIcon from "remixicon-react/PencilFillIcon";
import { MainContext } from "../../../context/MainContext";
import { OrderContext } from "../../../context/OrderContext";
import { parseCookies } from "nookies";
import { DrawerConfig } from "../../../configs/drawer-config";
import InputText from "../../form/form-item/InputText";
import { CheckCoupon } from "../../../api/main/check-coupon";
import { toast } from "react-toastify";
import { handleVisibleStoreInfo } from "../../../redux/slices/mainState";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { addToGeneralData, setDeliveryTime } from "../../../redux/slices/cart";
import getFirstValidDate from "../../../utils/getFirstValidDate";

const PickupForm = ({ deliveryPickup }) => {
  const dc = DrawerConfig;
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const { t: tl } = useTranslation();

  const { handleVisible } = useContext(MainContext);
  const { orderedProduct } = useContext(OrderContext);

  const [branch_id, setBrandId] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState(null);

  const shop = useSelector((state) => state.stores.currentStore, shallowEqual);
  const user = useSelector((state) => state.user.data, shallowEqual);
  const { generalData } = useSelector((state) => state.cart, shallowEqual);

  const { delivery_date, delivery_time } = generalData;
  const { date, time } = getFirstValidDate(shop);

  const isToday = dayjs(delivery_date).isSame(dayjs().format("YYYY-MM-DD"));
  const isTomorrow = dayjs(delivery_date).isSame(
    dayjs().add(1, "day").format("YYYY-MM-DD")
  );
  const day = dayjs(delivery_date).format("ddd");

  const handleBranch = (id) => {
    setBrandId(id);
  };

  const checkCoupon = (value) => {
    if (value) {
      CheckCoupon.create({
        coupon: value,
        user_id: user.id,
        shop_id: shop?.id,
      })
        .then((res) => {
          setPromoCode(res.data);
          setError(false);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
          setError(true);
        });
    } else setError(null);
  };

  const continuePickup = (e) => {
    e.preventDefault();
    if (!delivery_date) {
      toast.error("Please select delivery date");
    } else if (!deliveryPickup) {
      toast.error("Pickup not defind. Please selcet delivery type");
    } else {
      dispatch(
        addToGeneralData({
          currency_id: cookies?.currency_id,
          rate: cookies?.currency_rate,
          coupon: error === "error" ? "" : promoCode,
          coupon_price: error ? "" : promoCode?.price,
          coupon_type: error ? "" : promoCode?.type,
          delivery_type_id: deliveryPickup?.id,
          delivery_fee: 0,
          cart_id: orderedProduct?.id,
          shop_id: shop?.id,
          branch_id: branch_id || null,
        })
      );
      handleVisible(dc.payment);
    }
  };

  useEffect(() => {
    if (!delivery_time) {
      dispatch(
        setDeliveryTime({
          shop_id: shop?.id,
          delivery_date: date,
          delivery_time: time,
        })
      );
    }
  }, []);

  return (
    <div className="form-box">
      {shop?.branches?.map((type, key) => (
        <div key={key} className="type" onClick={() => handleBranch(type.id)}>
          <div className="left">
            <div className={`select-icon ${branch_id === type.id && "select"}`}>
              {branch_id === type.id ? (
                <CheckboxCircleFillIcon />
              ) : (
                <CheckboxBlankCircleLineIcon />
              )}
            </div>
            <div className="name">{type.translation.title}</div>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="rowBtn"
        onClick={() => dispatch(handleVisibleStoreInfo(true))}
      >
        <div className="item">
          <CalendarCheckLineIcon />
          <div className="naming">
            <div className="label">{tl("delivery.time")}</div>
            <div className="value">
              {isToday ? tl("today") : isTomorrow ? tl("tomorrow") : day},
              {delivery_time}
            </div>
          </div>
        </div>
        <div className="icon">
          <PencilFillIcon />
        </div>
      </button>
      <InputText
        label="Promo code"
        placeholder="Code"
        onBlur={(e) => {
          checkCoupon(e.target.value);
        }}
        value={promoCode?.name}
        onChange={(e) => setPromoCode(e.target.value)}
        invalid={error}
        valid={
          (typeof error === "string" || typeof error === "boolean") && true
        }
      />
      <div className="btn-group-box">
        <div
          className="btn btn-default"
          onClick={() => handleVisible(dc.order_list)}
        >
          {tl("Cancel")}
        </div>
        <div className="btn btn-dark" onClick={continuePickup}>
          {tl("Continue")}
        </div>
      </div>
    </div>
  );
};

export default PickupForm;
