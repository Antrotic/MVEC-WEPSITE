/* eslint-disable @next/next/no-img-element */
import React from 'react';
import cls from './fallbackImage.module.scss';
import Image from 'next/image';

export default function FallbackImage({
  src,
  alt = 'image',
  onError,
  style,
  fill,
  width,
  height,
}) {
  const isValidSrc =
    typeof src === 'string' && // Ensure src is a string
    (src.startsWith('/') ||
      src.startsWith('http://') ||
      src.startsWith('https://'));

  if (!isValidSrc) {
    console.error('Invalid image source:', src);
    return null; // Prevent rendering if src is invalid
  }

  return (
    <Image
      style={style}
      src={src}
      alt={alt}
      title={alt}
      fill={fill}
      width={width}
      height={height}
      className={cls.root}
      onError={e => {
        e.target.style.visibility = 'hidden';
        onError?.(e);
      }}
    />
  );
}
