import {parseCookies} from 'nookies';
import {useTranslation} from 'react-i18next';

export const commafy = num => {
  var str = num.toString().split('.');
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
};

// export const getPrice = (price = 0) => {
//   const {t: tl} = useTranslation();
//   const cookies = parseCookies();
//   if (price) {
//     if (cookies.currency_symbol) {
//       return `${decodeURI(tl(cookies.currency_symbol))} ${commafy(
//         parseFloat(price)?.toFixed(2),
//       )}`;
//     } else {
//       return `${tl(cookies.currency_symbol) || '$'} ${commafy(
//         price.toFixed(2),
//       )}`;
//     }
//   } else return '0.00';
// };

// export const getPrice = (price = 0) => {
//   const {t: tl} = useTranslation();
//   const cookies = parseCookies();
//   const formattedPrice = commafy(parseFloat(price)?.toFixed(2));
//   const currencySymbol = cookies.currency_symbol
//     ? decodeURI(tl(cookies.currency_symbol))
//     : 'د.أ';

//   // إرجاع السعر مع الوحدة في النهاية
//   return `${formattedPrice} ${currencySymbol}`;
// };

export const getPrice = (price = 0, currencySymbol = 'د.أ') => {
  const formattedPrice = commafy(parseFloat(price)?.toFixed(2));
  return `${formattedPrice} ${currencySymbol}`;
};
