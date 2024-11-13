import React from 'react';
import Link from 'next/link';
import {StarOutline} from '../../public/assets/images/svg';
import Bookmark3LineIcon from 'remixicon-react/Bookmark3LineIcon';
import {useDispatch, useSelector} from 'react-redux';
import {addCurrentStore} from '../../redux/slices/stores';
import {getImage} from '../../utils/getImage';
import StarSmileFillIcon from 'remixicon-react/StarSmileFillIcon';
import RunFillIcon from 'remixicon-react/RunFillIcon';
import getShortTimeType from '../../utils/getShortTimeType';
import {useTranslation} from 'react-i18next';
import ShopLogo from '../shopLogo/shopLogo';
import useShopWorkingSchedule from '../../hooks/useShopWorkingSchedule';
import FallbackImage from '../fallbackImage/fallbackImage';

function StoreCard({data}) {
  const dispatch = useDispatch();
  const likedStore = useSelector(state => state.savedStore.savedStoreList);
  const cartData = likedStore.find(item => item.id === data.id);
  const {isShopClosed} = useShopWorkingSchedule(data);

  const {t: tl} = useTranslation();

  console.log(data);

  console.log('hhhhhh');
  return (
    <Link href={`/stores/${data.slug}`} key={data.uuid}>
      <div
        className={`wrapper ${!data.open || isShopClosed ? 'closed' : ''}`}
        onClick={() => dispatch(addCurrentStore(data))}>
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
