import { useSelector } from "react-redux";
import { calculateChangeOptions } from "../../utils/getMoneyBack";
import { getPrice } from "../../utils/getPrice";
import { parseCookies } from "nookies";
import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";

const formatCurrency = (price) => {
  if (!price) return "";
  return new Intl.NumberFormat().format(price);
};

export default function MoneyBack({ handleChange }) {
  const {t: tl} = useTranslation()
  const [moneyBack, setMoneyBack] = useState("");
  const [hasError, setHasError] = useState(false);
  const cartTotalAmount = useSelector((state) => state.cart.cartTotalAmount);
  const items = useMemo(
    () => calculateChangeOptions(cartTotalAmount || 0),
    [cartTotalAmount]
  );
  const cookies = parseCookies();

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    // Remove non-numeric characters, except for the decimal point
    const cleanedValue = rawValue.replace(/[^0-9.]/g, "");
    setMoneyBack(cleanedValue || "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartTotalAmount >= moneyBack) return setHasError(true);
    handleChange(moneyBack);
  };

  return (
    <>
      <ul className="money-back">
        <li onClick={() => handleChange(0)} className="money-back__item">
          <span className="money-back__item-text">{tl('no_back_money')}</span>
        </li>
        {items.map((item) => (
          <li
            onClick={() => handleChange(item)}
            key={item}
            className="money-back__item"
          >
            <span className="money-back__item-text">{getPrice(item)}</span>
          </li>
        ))}
        <li className="money-back__item">
          <form className="money-back__form" onSubmit={handleSubmit}>
            <span className="money-back__unit">
              {cookies.currency_symbol || "$"}
            </span>
            <input
                className="theme-text-black"
              value={formatCurrency(moneyBack)}
              onChange={handleInputChange}
              placeholder={tl('custom_back_money_amount')}
              type="text"
            />
            <button>Submit</button>
          </form>
        </li>
      </ul>
      {hasError && (
        <span
          className={`money-back__error ${hasError ? "visible" : "hidden"}`}
        >
          Your order price is {getPrice(cartTotalAmount)}, enter greater amount
        </span>
      )}
    </>
  );
}
