import React, { useContext } from "react";
import InputText from "../form/form-item/InputText";
import SummaryProduct from "../products/summary-product";
import CheckoutStep from "./component/checkout-step";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { getPrice } from "../../utils/getPrice";
import { toast } from "react-toastify";
import { OrderApi } from "../../api/main/order";
import { clearCart, setCartData } from "../../redux/slices/cart";
import { TransactionsApi } from "../../api/main/transactions";
import { MainContext } from "../../context/MainContext";
import { useRouter } from "next/router";
import { useState } from "react";
import Paystack from "../payment/paystack";
import MyRazorpay from "../payment/razorpay";
import { DrawerConfig } from "../../configs/drawer-config";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Spinner } from "reactstrap";
const FinalPayment = ({
  payment,
  setVisible,
  setData,
  setCreatedOrderData,
  calculated,
}) => {
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const dc = DrawerConfig;
  const { handleVisible, getUser } = useContext(MainContext);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const [orderedData, setOrderedData] = useState({});
  const shop = useSelector((state) => state.stores.currentStore, shallowEqual);
  const generalData = useSelector(
    (state) => state.cart.generalData,
    shallowEqual
  );
  const { delivery_fee, coupon, coupon_price, coupon_type } = useSelector(
    (state) => state.cart.generalData,
    shallowEqual
  );
  const orderedProduct = useSelector(
    (state) => state.cart.orderedProduct,
    shallowEqual
  );
  const pay = ({ createdOrderData }) => {
    handleVisible(dc.create_payment);
    if (
      payment.payment.tag === "stripe" &&
      Object.keys(createdOrderData)?.length
    ) {
      axios
        .post("/api/create-stripe-session", {
          amount: createdOrderData.price,
          order_id: createdOrderData.id,
        })
        .then((res) => {
          console.log(res.data);
          setData(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const createOrder = () => {
    const orderData = {
      ...generalData,
      // note: comment,
    };
    if (orderData.auto_order) orderData.payment_sys_id = payment.id;
    setLoader(true);
    console.log('orderData sending', orderData)
    OrderApi.create(orderData)
      .then((res) => {
        console.log('orderData success', orderData)
        setOrderedData(res.data);
        setCreatedOrderData(res.data);
        if (
          payment.payment.tag === "cash" ||
          payment.payment.tag === "wallet"
        ) {
          TransactionsApi.create(res.data.id, {
            payment_sys_id: payment.id,
          })
            .then(() => {
              batch(() => {
                dispatch(clearCart(shop.id));
                dispatch(setCartData({}));
              });
              setVisible(false);
              toast.success("Order created successfully");
              router.push("/order-history");
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              if (payment.payment.tag === "wallet") getUser();
            });
        } else if (
          payment.payment.tag === "paypal" ||
          payment.payment.tag === "stripe"
        ) {
          pay({ createdOrderData: res.data });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const TotalPrice = () => {
    if (coupon_price) {
      if (coupon_type === "percent") {
        const value = calculated?.order_total * (coupon_price / 100);
        console.log(getPrice(calculated?.order_total + delivery_fee - value));
        return <>{getPrice(calculated?.order_total + delivery_fee - value)}</>;
      } else {
        return (
          <>{getPrice(calculated?.order_total + delivery_fee - coupon_price)}</>
        );
      }
    } else return <>{getPrice(calculated?.order_total + delivery_fee)}</>;
  };
  const CouponPrice = () => {
    if (coupon_price) {
      if (coupon_type === "percent") {
        const value = calculated?.order_total * (coupon_price / 100);
        return <>{getPrice(value)}</>;
      } else {
        return <>{getPrice(coupon_price)}</>;
      }
    } else return <>0</>;
  };
  return (
    <div className="final-payment">
      <CheckoutStep name="final-payment" />
      <div className="form-box">
        <InputText
          label="Comment"
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="your-order">
        <div className="title">{tl("Your Order")}</div>
        {calculated?.products?.map((data, key) =>
          data.bonus ? (
            <SummaryProduct
              key={key}
              isBonus={data.bonus}
              data={data}
              qty={data.qty}
            />
          ) : (
            <SummaryProduct key={key} data={data} />
          )
        )}
        {Boolean(calculated.bonus_shop?.length) &&
          calculated.bonus_shop?.map((item) => (
            <SummaryProduct
              isBonus={item}
              data={item?.shop_product}
              qty={item?.bonus_quantity}
            />
          ))}
      </div>
      <div className="total-product-price">
        <div className="label">{tl("Total product price")}</div>
        <div className="value">
          {getPrice(calculated?.product_total + calculated?.total_discount)}
        </div>
      </div>
      <div className="expenses">
        <div className="item">
          <div className="label">{tl("Discount")}</div>
          <div className="value">{getPrice(calculated?.total_discount)}</div>
        </div>
        <div className="item">
          <div className="label">{tl("Delivery")}</div>
          <div className="value">{getPrice(delivery_fee)}</div>
        </div>
        <div className="item">
          <div className="label">{tl("vat_tax")}</div>
          <div className="value">{getPrice(calculated?.product_tax)}</div>
        </div>
        <div className="item">
          <div className="label">{tl("shop_tax")}</div>
          <div className="value">{getPrice(calculated?.order_tax)}</div>
        </div>
        {coupon && (
          <div className="item coupon">
            <div className="label">{tl("Coupon")}</div>
            <div className="value">
              <CouponPrice />
            </div>
          </div>
        )}
      </div>
      <div className="total-price">
        <div className="label">{tl("Total Amount")}</div>
        <div className="value">
          <TotalPrice />
        </div>
      </div>
      <div className="to-checkout">
        <div className="total-amount">
          <div className="label">{tl("Total amount")}</div>
          <div className="count">
            <TotalPrice />
          </div>
        </div>
        {payment?.payment.tag === "paystack" ? (
          <Paystack
            createOrder={createOrder}
            payment={payment}
            orderedData={orderedData}
          />
        ) : payment?.payment.tag === "razorpay" ? (
          <MyRazorpay
            generalData={generalData}
            note={comment}
            products={orderedProduct}
            payment={payment}
          />
        ) : (
          <button onClick={createOrder} className="btn btn-success">
            {loader ? <Spinner /> : tl("Checkout")}
          </button>
        )}
      </div>
    </div>
  );
};

export default FinalPayment;
