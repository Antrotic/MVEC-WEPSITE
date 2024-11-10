import React from 'react';
import Link from 'next/link';
import {shallowEqual, useSelector} from 'react-redux';
import {Swiper, SwiperSlide} from 'swiper/react';
import Gift2LineIcon from 'remixicon-react/Gift2LineIcon';
import TaskList from '../loader/category-loader';
import {images} from '../../constants/images';
import {useTranslation} from 'react-i18next';

function Category({shopSlug}) {
  const {t} = useTranslation();
  const categoryList = useSelector(
    state => state.category.categoryList,
    shallowEqual,
  );

  return (
    <Swiper
      slidesPerView={'auto'}
      spaceBetween={10}
      className="swiper-category">
      <SwiperSlide>
        <Link href={`/stores/${shopSlug}/gift-card`}>
          <div className="item" style={{textAlign: 'center', padding: '10px'}}>
            <img src={images.GiftCard} alt={t('Gift card')} />
            <div className="item">{t('Gift card')}</div>
          </div>
        </Link>
      </SwiperSlide>
      {categoryList.map(item => (
        <SwiperSlide key={item.uuid}>
          <Link
            href={`/stores/${shopSlug}/all-product-by-category/${item.slug}`}>
            <div
              className="item"
              style={{textAlign: 'center', padding: '10px'}}>
              <img src={item.img} alt={item.translation.title} />
              <div className="item">{item.translation.title}</div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Category;
