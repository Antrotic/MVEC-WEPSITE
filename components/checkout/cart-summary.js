import React, { useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { CartApi } from "../../api/main/cart";
import SummaryProduct from "../../components/products/summary-product";
import { DrawerConfig } from "../../configs/drawer-config";
import { MainContext } from "../../context/MainContext";
import { OrderContext } from "../../context/OrderContext";
import { getPrice } from "../../utils/getPrice";
import OrderedProductLoader from "../loader/ordered-product";
import AutoOrder from "../auto-order";
import { addToGeneralData } from "../../redux/slices/cart";
import OrderImages from "../order-images";

const CartSummary = ({ setCalculated, calculated }) => {
  const { t: tl } = useTranslation();
  const dc = DrawerConfig;
  const { handleVisible } = useContext(MainContext);
  const { orderedProduct } = useContext(OrderContext);

  const dispatch = useDispatch();

  const [orderImages, setOrderImages] = useState([]);
  const [autoOrderData, setAutoOrderData] = useState({
    auto_order: false,
    start_date: null,
    end_date: null,
  });

  /* 
      handleAutoOrder returns true if its data valid and dispatches the data to "generalData"
      handleAutoOrder reutrns false if its data not valid and removes the values from "generalData"
   */
  const handleAutoOrder = () => {
    if (!autoOrderData.auto_order) {
      dispatch(
        addToGeneralData({
          date: undefined,
          type: undefined,
          auto_order: undefined,
        })
      );
      return true;
    }

    const endDate = autoOrderData.end_date;
    const startDate = autoOrderData.start_date;

    if (!endDate || !startDate) {
      toast.error("Select auto order dates");
      return false;
    }

    const formattedAutoOrder = {
      auto_order: true,
      type: "fix",
      date: {
        start_date: moment(autoOrderData.start_date).format("YYYY-MM-DD"),
        end_date: moment(autoOrderData.end_date).format("YYYY-MM-DD"),
      },
    };

    dispatch(addToGeneralData(formattedAutoOrder));
    return true;
  };

  const handleOrderImage = () => {
    if (!orderImages.length)
      return dispatch(addToGeneralData({ images: undefined }));

    const formattedOrderImageData = {
      images: orderImages.map((imageData) => imageData.imgSrc),
    };
    dispatch(addToGeneralData(formattedOrderImageData));
  };

  const getCalculate = () => {
    CartApi.calculate(orderedProduct?.id, {
      currency_id: parseCookies().currency_id,
    })
      .then((res) => {
        setCalculated(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (orderedProduct?.id) getCalculate();
  }, []);
  return (
    <div className='cart-summary'>
      {calculated?.products ? (
        calculated?.products?.map((data, key) =>
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
        )
      ) : (
        <>
          <OrderedProductLoader />
          <OrderedProductLoader />
        </>
      )}
      {Boolean(calculated.bonus_shop?.length) &&
        calculated.bonus_shop?.map((item) => (
          <SummaryProduct
            isBonus={item}
            data={item?.shop_product}
            qty={item?.bonus_quantity}
          />
        ))}
      <div className='total-price'>
        <div className='label'>{tl("Total product price")}</div>
        <div className='value'>
          {getPrice(calculated?.product_total + calculated?.total_discount)}
        </div>
      </div>
      <div className='expenses'>
        <div className='item'>
          <div className='label'>{tl("Discount")}</div>
          <div className='value'>{getPrice(calculated?.total_discount)}</div>
        </div>
        <div className='item'>
          <div className='label'>{tl("Shop tax")}</div>
          <div className='value'>{getPrice(calculated?.order_tax)}</div>
        </div>
        <div className='item'>
          <div className='label'>{tl("VAT tax")}</div>
          <div className='value'>{getPrice(calculated?.product_tax)}</div>
        </div>
      </div>
      <div className='total-amount'>
        <div className='label'>{tl("Total Amount")}</div>
        <div className='value'>{getPrice(calculated?.order_total)} 11</div>
      </div>
      <div className='order-images'>
        <OrderImages
          orderImages={orderImages}
          setOrderImages={setOrderImages}
        />
      </div>
      <div className='auto-order'>
        <AutoOrder
          autoOrderData={autoOrderData}
          setAutoOrderData={setAutoOrderData}
        />
      </div>
      <div className='btn-group-box'>
        <div
          className='btn btn-default'
          onClick={() => handleVisible(dc.order_list)}
        >
          {tl("Cancel")}
        </div>
        <div
          className='btn btn-success'
          onClick={() => {
            if (handleAutoOrder()) {
              handleOrderImage()
              handleVisible(dc.checkout);
            }
          }}
        >
          {tl("Order now")}
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
