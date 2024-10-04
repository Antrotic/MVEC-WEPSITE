import React from "react";
import { getImage } from "../../utils/getImage";
import { getPrice } from "../../utils/getPrice";

const OrderHistoryProduct = ({ data, qty, isBonus }) => {
  return (
    <div className={`summary-product ${isBonus && "replacement"}`}>
      <div className="product-img">
        {getImage(data?.shopProduct?.product?.img)}
      </div>
      <div className="text-content">
        <div className="product-name">
          {data?.shopProduct?.product?.translation?.title}
        </div>
        <div className="price">
          {isBonus
            ? `+${qty} bonus`
            : `${getPrice(data?.origin_price / Number(qty))} x ${qty} ${
                data?.shopProduct?.product?.unit?.translation?.title
              }`}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryProduct;
