import React from "react";
import Link from "next/link";
import { shallowEqual, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import Gift2LineIcon from 'remixicon-react/Gift2LineIcon'
import TaskList from "../loader/category-loader";

function Category({ shopSlug }) {
  const categoryList = useSelector(
    (state) => state.category.categoryList,
    shallowEqual
  );

  return (
    <Swiper
      slidesPerView={"auto"}
      spaceBetween={10}
      className="swiper-category"
    >
      <SwiperSlide>
        <Link
            href={`/stores/${shopSlug}/gift-card`}
        >
          <div className="item gift-card-btn"><Gift2LineIcon style={{height: "20px"}}/>Gift card</div>
        </Link>
      </SwiperSlide>
      {categoryList.map((item) => (
        <SwiperSlide key={item.uuid}>
          <Link
            href={`/stores/${shopSlug}/all-product-by-category/${item.slug}`}
          >
            <div className="item">{item.translation.title}</div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Category;
