import React, { useContext, useEffect, useState } from "react";
import CheckoutStep from "./component/checkout-step";
import { DrawerConfig } from "../../configs/drawer-config";
import { MainContext } from "../../context/MainContext";
import { PaymentApi } from "../../api/main/payment";
import DiscordLoader from "../loader/discord-loader";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CheckboxCircleFillIcon from "remixicon-react/CheckboxCircleFillIcon";
import CheckboxBlankCircleLineIcon from "remixicon-react/CheckboxBlankCircleLineIcon";
import { OrderContext } from "../../context/OrderContext";
import MyModal from "../modal";
import useModal from "../../hooks/useModal";
import MoneyBack from "../money-back";
import { addToGeneralData } from "../../redux/slices/cart";
import { getPrice } from "../../utils/getPrice";

const Payment = ({ setPayment }) => {
  const dc = DrawerConfig;
  const { t: tl } = useTranslation();
  const { handleVisible } = useContext(MainContext);
  const { orderedProduct } = useContext(OrderContext);

  const [paymentType, setPaymentType] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState({});
  const [currentMoneyBack, setCurrentMoneyBack] = useState(0);
  const shop = useSelector((state) => state.stores.currentStore, shallowEqual);
  const user = useSelector((state) => state.user.data, shallowEqual);

  const dispatch = useDispatch();

  const [open, handleOpen, handleClose] = useModal();

  const getPayment = () => {
    PaymentApi.get({ shop_id: shop?.id })
      .then((res) => {
        setPaymentType(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePayment = (e) => {
    if (e.payment.tag === "cash") return handleOpen();

    setSelectedPayment(e.payment);
    setPayment(e);
    setCurrentMoneyBack(undefined);
  };

  const handleContinue = () => {
    if (selectedPayment.tag === "wallet") {
      // minus coupon price
      if (
        parseFloat(user?.wallet?.price) <
        parseFloat(orderedProduct?.total_price)
      )
        toast.error("You don't have enough funds in your wallet");
      else {
        dispatch(
          addToGeneralData({
            money_back: currentMoneyBack ? currentMoneyBack : undefined,
          })
        );
        handleVisible(dc.final_payment);
      }
    } else {
      if (selectedPayment.tag) {
        dispatch(
          addToGeneralData({
            money_back: currentMoneyBack ? currentMoneyBack : undefined,
          })
        );
        handleVisible(dc.final_payment);
      } else toast.error("Please select payment type!");
    }
  };

  useEffect(() => {
    getPayment();
  }, []);
  return (
    <div className='payment'>
      <CheckoutStep name='payment' />
      <div className='method'>
        <div className='title'>{tl("Payment method")}</div>
        <div className='method-items'>
          {paymentType ? (
            paymentType?.map((type, key) => (
              <div
                key={key}
                className='method-item'
                onClick={() => handlePayment(type)}
              >
                <div
                  className={`icon ${
                    selectedPayment?.id === type.payment.id && "select"
                  }`}
                >
                  {selectedPayment?.id === type.payment.id ? (
                    <CheckboxCircleFillIcon />
                  ) : (
                    <CheckboxBlankCircleLineIcon />
                  )}
                </div>
                <div className='label'>
                  {type.payment.translation.title}
                  {/* In "cash" option, showing money back amount logic*/}
                  {type.payment.tag === "cash" &&
                    currentMoneyBack !== undefined &&
                    selectedPayment?.id === type.payment.id &&
                    (currentMoneyBack === 0
                      ? " (No need of MoneyBack)"
                      : ` (MoneyBack ${getPrice(currentMoneyBack)})`)}
                </div>
              </div>
            ))
          ) : (
            <DiscordLoader />
          )}
        </div>
      </div>
      <div className='btn-group-box'>
        <div
          className='btn btn-default'
          onClick={() => handleVisible(dc.order_list)}
        >
          {tl("Cancel")}
        </div>
        <div className='btn btn-dark' onClick={handleContinue}>
          {tl("Continue")}
        </div>
      </div>

      <MyModal
        visible={open}
        handleClose={handleClose}
        className='address-modal'
        centered={true}
        title={tl('money_back_amount')}
      >
        <MoneyBack
          handleChange={(moneyBackValue) => {
            const cashPayment = paymentType.find(
              (item) => item.payment.tag === "cash"
            );
            setCurrentMoneyBack(moneyBackValue);
            setSelectedPayment(cashPayment.payment);
            setPayment(cashPayment);
            handleClose();
          }}
        />
      </MyModal>
    </div>
  );
};

export default Payment;
