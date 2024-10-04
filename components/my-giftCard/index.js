// import { useRef } from "react";
import { getImage } from "../../utils/getImage";
import { getPrice } from "../../utils/getPrice";

export default function MyGiftCard({ data }) {
  // const cardEl = useRef();
  // const highlightCard = () => {
  //   const highligterClass = "highliting";
  //   cardEl.current.classList.add(highligterClass);
  //   setTimeout(() => {
  //     cardEl.current.classList.remove(highligterClass);
  //   }, 1000);
  // };
  return (
    <div
      // onClick={highlightCard}
      // ref={cardEl}
      className='product-card gift-card border p-1 rounded'
    >
      <img src='/assets/images/party-flag.png' height={500} width={500} className="party-flag"/>
      <div className='product-img'>
        {getImage(data.shop_product.product?.img)}
      </div>
      <p className='theme-text-black'>{data?.shop_product?.product?.translation?.title}</p>
      <div className='product-card-footer'>
        <div className='price'>
          $
          {data.discount
            ? getPrice(data.price - data.discount)
            : getPrice(data.price)}{" "}
        </div>

      </div>

      <p className='product-name'>{data.product?.translation?.title}</p>

      <div className='product-name'>
        {data.quantity < data.min_qty && <a>{tl("out of stock")}</a>}
      </div>
    </div>
  );
}
