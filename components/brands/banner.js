import React from "react";
import { images } from "../../constants/images";

const BrandBanner = ({ brand }) => {
  return (
    <div className="brand-banner">
      <div className="logo">
        <img
          src={process.env.NEXT_PUBLIC_IMG_BASE_URL + brand?.data?.brand.img}
          alt="logo"
        />
      </div>
      <div className="banner-img">
        <img src={images.Banner} alt="logo" />
      </div>
    </div>
  );
};

export default BrandBanner;
