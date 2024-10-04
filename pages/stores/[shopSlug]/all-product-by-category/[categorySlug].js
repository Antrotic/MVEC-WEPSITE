import React, { useCallback, useEffect, useRef, useState } from "react";
import ProductSection from "../../../../components/products/section";
import ProductCard from "../../../../components/products/card";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import SEO from "../../../../components/seo";
import axiosService from "../../../../services/axios";
import { ProductApi } from "../../../../api/main/product";
import RiveResult from "../../../../components/loader/rive-result";
import ProductLoader from "../../../../components/loader/product";
import nookies from "nookies";
const AllProductByCategory = ({ categoryDetail, query }) => {
  const [list, setList] = useState(null);
  const [meta, setMeta] = useState({ current_page: 1 });
  const [loader, setLoader] = useState(false);
  const observer = useRef();
  const { current_page, last_page, total } = meta;
  const [currentCategory, setCurrentCategory] = useState(
    categoryDetail?.children[0]
  );
  const getProduct = (perPage = 15, page) => {
    setLoader(true);
    ProductApi.get({
      perPage,
      page,
      category_id: currentCategory?.id || categoryDetail?.id,
      shop_slug: query?.shopSlug
    })
      .then((response) => {
        setMeta(response.meta);
        setList((prevList) =>
          prevList ? [...prevList, ...response.data] : response.data
        );
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handleCategory = (data) => {
    if (data.id !== currentCategory?.id) {
      setList(null);
      setCurrentCategory(data);
      setMeta((prev) => ({
        ...prev,
        current_page: 1,
      }));
    }
  };

  useEffect(() => {
    getProduct(15, current_page);
  }, [current_page, currentCategory]);

  const hasMore = Boolean(last_page > current_page);

  const lastBookElementRef = useCallback(
    (node) => {
      if (loader) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setMeta((prev) => ({
            ...prev,
            current_page: prev.current_page + 1,
          }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [loader, hasMore]
  );
  return (
    <>
      <SEO />
      <SiderHorizontal
        goBack={true}
        address={true}
        searchFilter={true}
        timeRange={true}
        balance={true}
      />
      <div className="category">
        <div className="name">{categoryDetail?.translation.title}</div>
        <div className="items">
          {categoryDetail?.children.map((item) => (
            <div
              key={item.uuid}
              className={`item ${
                currentCategory?.id === item?.id ? "active" : ""
              }`}
              onClick={() => handleCategory(item)}
            >
              <img
                src={process.env.NEXT_PUBLIC_IMG_BASE_URL + item?.img}
                alt="children"
              />
              <div className="name">{item?.translation?.title}</div>
            </div>
          ))}
        </div>
      </div>
      <ProductSection title="">
        {list ? (
          list.map((data, key) => <ProductCard key={key} data={data} />)
        ) : (
          <ProductLoader />
        )}
        {loader && <ProductLoader />}
        {list?.length === 0 && <RiveResult text="Product not found" />}
        <div ref={lastBookElementRef} />
      </ProductSection>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const params = {
    lang: language_locale,
  };
  try {
    const res = await axiosService.get(`/rest/categories/slug/${query.categorySlug}`, {
      params,
    });
    const categoryDetail = await res.data.data;
    return {
      props: {
        categoryDetail,
        error: {},
        query,
      },
    };
  } catch (error) {
    return {
      props: {
        data: {},
        error: error,
      },
    };
  }
}
export default AllProductByCategory;
