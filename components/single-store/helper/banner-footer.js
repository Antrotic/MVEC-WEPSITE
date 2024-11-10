import React from 'react';
import {useTranslation} from 'react-i18next';
import Bookmark3LineIcon from 'remixicon-react/Bookmark3LineIcon';
import ErrorWarningLineIcon from 'remixicon-react/ErrorWarningLineIcon';
import StarFillIcon from 'remixicon-react/StarFillIcon';
import TruckLineIcon from 'remixicon-react/TruckLineIcon';
import GroupLineIcon from 'remixicon-react/GroupLineIcon';
import {shallowEqual, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/ar'; // Import the Arabic locale
import {parseCookies} from 'nookies';
import ShopShare from '../../shopShare/shopShare';
import {images} from '../../../constants/images';

const BannerFooter = ({
  data,
  setVisible,
  saved,
  savedStore,
  handleTogether,
}) => {
  const cookies = parseCookies();
  const {t: tl} = useTranslation();
  const {generalData} = useSelector(state => state.cart, shallowEqual);
  const language_locale = cookies?.language_locale;

  dayjs.locale(language_locale);
  return (
    <div className="banner-footer">
      <div className="title">{data.translation?.title}</div>
      <div className="info">
        <div className="item" onClick={() => setVisible('store-info')}>
          <div className="label">
            <img
              src={images.StoreInfo}
              alt={tl('Store info')}
              style={{width: '55px'}}
            />
            <div className="text">{tl('Store info')}</div>
          </div>
        </div>
        <span></span>
        <div className="item">
          <div className="label" onClick={() => setVisible('store-delivery')}>
            <img
              src={images.Schedule}
              alt={tl('schedule')}
              style={{width: '55px'}}
            />
            <div className="text">
              {generalData.delivery_time ? tl('edit.schedule') : tl('schedule')}
            </div>
            {!!generalData.delivery_time && (
              <div className="time">
                {dayjs(generalData.delivery_date).format('MMM D')} Delivery time
                : {generalData.delivery_time}
              </div>
            )}
          </div>
        </div>
        <span></span>
        <div className="item">
          <StarFillIcon className="icon" color="#FFB800" />
          <div className="label">
            {data.rating_avg ? data.rating_avg : '0.0'}
          </div>
        </div>
        <div className="item">
          <ShopShare data={data} />
        </div>
      </div>
    </div>
  );
};

export default BannerFooter;
