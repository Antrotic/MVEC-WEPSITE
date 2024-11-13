import React, {useContext} from 'react';
import Link from 'next/link';
import {useDispatch, useSelector, shallowEqual} from 'react-redux'; // تأكد من استيراد shallowEqual هنا
import {addCurrentStore} from '../../redux/slices/stores';
import {useTranslation} from 'react-i18next';
import {parseCookies} from 'nookies';
import {clearCartData} from '../../utils/cartUtils';
import {MainContext} from '../../context/MainContext';
import {OrderContext} from '../../context/OrderContext';
import useShopWorkingSchedule from '../../hooks/useShopWorkingSchedule';
import FallbackImage from '../fallbackImage/fallbackImage';
import ShopLogo from '../shopLogo/shopLogo';
import getShortTimeType from '../../utils/getShortTimeType';
import StarSmileFillIcon from 'remixicon-react/StarSmileFillIcon';
import RunFillIcon from 'remixicon-react/RunFillIcon';

function StoreCard({data}) {
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const {t: tl} = useTranslation();
  const {setVisible} = useContext(MainContext);
  const {setOrderedProduct, orderedProduct} = useContext(OrderContext); // استخدام OrderContext للحصول على setOrderedProduct و orderedProduct
  const {isShopClosed} = useShopWorkingSchedule(data);
  const shop = useSelector(state => state.stores.currentStore, shallowEqual);

  const handleClick = () => {
    if (!cookies.accessToken && !shop.id) {
      clearCartData(
        dispatch,
        setVisible,
        setOrderedProduct,
        orderedProduct,
        shop.id,
      );
    } else {
      dispatch(addCurrentStore(data));
    }
  };

  return (
    <Link href={`/stores/${data.slug}`} key={data.uuid}>
      <div
        className={`wrapper ${!data.open || isShopClosed ? 'closed' : ''}`}
        onClick={handleClick}>
        <div className="header">
          {(!data.open || isShopClosed) && (
            <div className="closedText">{tl('closed')}</div>
          )}
          <FallbackImage
            fill
            src={data.background_img}
            alt={data.translation?.title}
            sizes="400px"
            width={400}
            height={400}
          />
        </div>
        <div className="body">
          <div className="shopLogo">
            <ShopLogo data={data} />
          </div>
          <h3 className="title">{data.translation?.title}</h3>
          <p className="text">{data.translation?.description}</p>
        </div>
        <div className="footer">
          <div className="flex">
            <span className="greenDot" />
            <RunFillIcon />
            <span className="text">
              {data.delivery_time?.from}-{data.delivery_time?.to}{' '}
              {tl(getShortTimeType(data.delivery_time?.type))}
            </span>
          </div>
          <span className="dot" />
          <div className="flex">
            <StarSmileFillIcon className="ratingIcon" />
            <span className="text">
              {data.rating_avg ? parseFloat(data.rating_avg).toFixed(1) : '0.0'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default StoreCard;
