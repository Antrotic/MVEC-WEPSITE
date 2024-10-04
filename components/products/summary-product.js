import React from "react";
import { getImage } from "../../utils/getImage";
import { getPrice } from "../../utils/getPrice";

const SummaryProduct = ({ data, qty, isBonus = false }) => {
  const isGiftCard = data?.product.gift === 1;

  const productUnit = !isGiftCard
    ? ` x ${data?.qty ? data?.qty : qty} ${
        data?.product?.unit?.translation?.title
      }`
    : "";
  return (
    <div className={`summary-product ${isBonus && "replacement"}`}>
      <div className='product-img'>{getImage(data?.product?.img)}</div>
      <div className='text-content'>
        <div className='product-name'>{data?.product?.translation?.title}</div>
        <div className='price'>
          {isBonus
            ? `+${qty} bonus`
            : data?.discount
            ? `${getPrice(data.price_without_tax / data.qty)} ${productUnit}`
            : `${getPrice(data?.price)} ${productUnit}`}
        </div>
      </div>
    </div>
  );
};

export default SummaryProduct;
