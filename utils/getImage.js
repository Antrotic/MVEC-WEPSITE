import React from "react";
import Image from "next/image";

export const getImage = (src, alt = "product img") => {
  const myLoader = ({ src, width, quality }) => {
    return `${process.env.NEXT_PUBLIC_IMG_BASE_URL}${src}?w=${width}&q=${
      quality || 90
    }`;
  };

  if (src)
    return (
      <Image
        loader={myLoader}
        src={src}
        alt={alt}
        layout="fill"
        loading="lazy"
      />
    );
};

export const getStaticImage = (src, alt = "product img") => {
  const myLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 90}`;
  };
  if (src)
    return (
      <Image
        loader={myLoader}
        src={src}
        alt={alt}
        layout="fill"
        loading="lazy"
      />
    );
};
