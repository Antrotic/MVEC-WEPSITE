import React from 'react';
import cls from './shopLogo.module.scss';
import FallbackImage from '../fallbackImage/fallbackImage';

export default function ShopLogo({data, size = 'medium'}) {
  return (
    <div className={`${cls.logo} ${cls[size]}`}>
      <span className={cls.wrapper}>
        <FallbackImage
          fill
          src={data.logo_img}
          alt={data.translation?.title}
          sizes="(max-width: 768px) 40px, 60px"
          quality={90}
          width={400}
          height={400}
        />
      </span>
    </div>
  );
}
