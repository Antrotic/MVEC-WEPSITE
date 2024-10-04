import React, { useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";
import InnerImageZoom from "react-inner-image-zoom";
import { getImage } from "../../utils/getImage";
import { images } from "../../constants/images";

const ImgMagnify = ({ galleries, product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const windowSize = useWindowSize();
  return (
    <div className="left">
      {product?.bonus?.status && (
        <img className="bonus-icon" src={images.Bonus} />
      )}
      <div className="slide-img-box">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={20}
          slidesPerView={"auto"}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="product-sm-img"
          direction={windowSize.width > 820 ? "vertical" : "horizontal"}
        >
          {galleries?.map((img, key) => (
            <SwiperSlide key={key}>{getImage(img.path)}</SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="product-lg-img"
        >
          {galleries?.map((img, key) => (
            <SwiperSlide key={key}>
              <InnerImageZoom
                src={process.env.NEXT_PUBLIC_IMG_BASE_URL + img.path}
                zoomSrc={process.env.NEXT_PUBLIC_IMG_BASE_URL + img.path}
                zoomType="hover"
                zoomPreload={true}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ImgMagnify;
