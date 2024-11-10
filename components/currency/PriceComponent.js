import React from 'react';
import {parseCookies} from 'nookies';
import {useTranslation} from 'react-i18next';
import {getPrice} from '../../utils/getPrice';

const PriceComponent = ({price}) => {
  const {t: tl} = useTranslation();
  const cookies = parseCookies();

  // الحصول على رمز العملة وترجمتها
  const currencySymbol = cookies.currency_symbol
    ? decodeURI(tl(cookies.currency_symbol))
    : 'د.أ';

  return <div>{getPrice(price, currencySymbol)}</div>;
};

export default PriceComponent;
