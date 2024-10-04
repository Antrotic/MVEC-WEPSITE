import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CalendarCheckLineIcon from "remixicon-react/CalendarCheckLineIcon";
import CheckboxBlankCircleLineIcon from "remixicon-react/CheckboxBlankCircleLineIcon";
import CheckboxCircleFillIcon from "remixicon-react/CheckboxCircleFillIcon";
import PencilFillIcon from "remixicon-react/PencilFillIcon";
import DiscordLoader from "../../loader/discord-loader";
import { Alert, Toast, ToastBody } from "reactstrap";
import CustomSelect from "../../form/form-item/customSelect";
import InputText from "../../form/form-item/InputText";
import { toast } from "react-toastify";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CheckCoupon } from "../../../api/main/check-coupon";
import { MainContext } from "../../../context/MainContext";
import { OrderContext } from "../../../context/OrderContext";
import { parseCookies } from "nookies";
import { DrawerConfig } from "../../../configs/drawer-config";
import dayjs from "dayjs";
import { addToGeneralData, setDeliveryTime } from "../../../redux/slices/cart";
import { handleVisibleStoreInfo } from "../../../redux/slices/mainState";
import getFirstValidDate from "../../../utils/getFirstValidDate";
import checkShopLocationService from "../../../services/check-shop-location";
import { useMemo } from "react";
import CartLoader from "../../loader/cart-loader";
import MakeGift from "./make-gift";

const DeliveryForm = ({ deliveryTypes }) => {
  // Constants and variables
  const dc = DrawerConfig;
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const cookies = parseCookies();

  // Redux state hooks
  const user = useSelector((state) => state.user.data, shallowEqual);
  const shop = useSelector((state) => state.stores.currentStore, shallowEqual);
  const { generalData } = useSelector((state) => state.cart, shallowEqual);
  const { delivery_date, delivery_time } = generalData;
  const addressList =
    user?.addresses?.map((item) => ({
      value: item.id,
      label: item.address,
      location: item.location,
    })) || [];

  // Date handling
  const { date, time } = useMemo(() => getFirstValidDate(shop), [shop]);
  const isToday = useMemo(
    () => dayjs(delivery_date).isSame(dayjs().format("YYYY-MM-DD")),
    [delivery_date]
  );
  const isTomorrow = useMemo(
    () =>
      dayjs(delivery_date).isSame(dayjs().add(1, "day").format("YYYY-MM-DD")),
    [delivery_date]
  );
  const day = useMemo(() => dayjs(delivery_date).format("ddd"));

  // Context hooks
  const { handleVisible } = useContext(MainContext);
  const { orderedProduct } = useContext(OrderContext);

  // State hooks
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [unavailable, setUnavailable] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState(null);
  const [currentShippingMethod, setCurrentShippingMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [giftData, setGiftData] = useState({});

  const handleShippingMethod = (delivery) => {
    setCurrentShippingMethod(delivery);
  };

  const handleSelectAddress = (e) => {
    setIsLoading(true);
    setDeliveryAddress(e);
    const { latitude, longitude } = e.location;
    checkShopLocationService
      .check({
        id: shop?.id,
        currency_id: cookies?.currency_id,
        "address[latitude]": latitude,
        "address[longitude]": longitude,
      })
      .then(({ data }) => {
        setDeliveryFee(data?.data?.delivery_fee);
        setUnavailable(false);
      })
      .catch((error) => {
        console.error(error);
        setDeliveryFee(null);
        setUnavailable(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
          toast.error(error.response.data?.message);
          setError(true);
        });
    } else setError(null);
  };

  const handleCountinue = (e) => {
    e.preventDefault();
    if (!currentShippingMethod) {
      toast.error("Please select delivery shipping method");
    } else if (!deliveryAddress) {
      toast.error("Please select delivery address");
    } else if (!delivery_date) {
      toast.error("Please select delivery date");
    } else if (!delivery_time) {
      toast.error("Please select delivery time");
    } else {
      dispatch(
        addToGeneralData({
          currency_id: cookies?.currency_id,
          rate: cookies?.currency_rate,
          coupon: error ? "" : promoCode?.name,
          coupon_price: error ? "" : promoCode?.price,
          coupon_type: error ? "" : promoCode?.type,
          delivery_type_id: currentShippingMethod?.id,
          delivery_address_id: deliveryAddress?.id,
          delivery_fee: deliveryFee,
          cart_id: orderedProduct?.id,
          shop_id: shop?.id,
          ...giftData,
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
    <>
      {isLoading && <CartLoader />}
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
      {deliveryTypes ? (
        deliveryTypes
          ?.filter((i) => i.type !== "pickup")
          ?.map((type, key) => (
            <div
              key={key}
              className="type"
              onClick={() => handleShippingMethod(type)}
            >
              <div className="left">
                <div
                  className={`select-icon ${
                    currentShippingMethod?.id === type.id && "select"
                  }`}
                >
                  {currentShippingMethod?.id === type.id ? (
                    <CheckboxCircleFillIcon />
                  ) : (
                    <CheckboxBlankCircleLineIcon />
                  )}
                </div>
                <div className="delivery-name">
                  <div className="name">{type.translation.title}</div>
                </div>
              </div>
              {/* <div className="right">
                {`${type.times[0]} - ${type.times[1]} ${"days"}`}
              </div> */}
            </div>
          ))
      ) : (
        <DiscordLoader />
      )}
      {deliveryTypes?.length === 0 && (
        <Toast className="bg-warning text-white">
          <ToastBody>{tl("delivery.method.not.found")}</ToastBody>
        </Toast>
      )}
      <MakeGift setGiftData={setGiftData} giftData={giftData} />
      <div className="form-box">
        <CustomSelect
          options={addressList}
          label="Address"
          placeholder={deliveryAddress?.label || "Address"}
          onChange={(e) => handleSelectAddress(e)}
          value={deliveryAddress?.id}
          name="delivery_address_id"
          required={true}
          type="address"
        />
        <div className="d-flex gap-2">
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
          <button className="btn btn-dark btn-sm">{tl("Apply")}</button>
        </div>

        {unavailable && (
          <Alert className="mt-3" color="danger">
            {tl("unavailable.text")}
          </Alert>
        )}
        <div className="btn-group-box">
          <div
            className="btn btn-default mr-1"
            onClick={() => handleVisible(dc.order_list)}
          >
            {tl("Cancel")}
          </div>
          <button
            className="btn btn-dark"
            onClick={handleCountinue}
            disabled={Boolean(deliveryFee === null)}
          >
            {tl("Continue")}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeliveryForm;
