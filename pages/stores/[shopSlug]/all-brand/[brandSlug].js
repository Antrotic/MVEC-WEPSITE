import React, { useCallback, useEffect, useRef, useState } from "react";
import nookies from "nookies";
import ProductCard from "../../../../components/products/card";
import ProductSection from "../../../../components/products/section";
import axiosService from "../../../../services/axios";
import { ProductApi } from "../../../../api/main/product";
import SEO from "../../../../components/seo";
import RiveResult from "../../../../components/loader/rive-result";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import ProductLoader from "../../../../components/loader/product";

const BrandDetail = ({ brand, products, shop_slug, error }) => {
  const [meta, setMeta] = useState(products.meta || {});
  const [loader, setLoader] = useState(false);
  const observer = useRef();
  const { current_page, last_page, total } = meta;
  const [productList, setProductList] = useState(products.data);

  const getProduct = (perPage = 15, page = 1) => {
    setLoader(true);
    ProductApi.get({ perPage, page, brand_id: brand?.data?.brand?.id, shop_slug })
      .then((response) => {
        setMeta(response.meta);
        setProductList((prev) => [...prev, ...response.data]);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (current_page >= 2) getProduct(15, current_page);
  }, [current_page]);

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

  if (error?.params) {
    for (const element in error.params) {
      return `${error.params[element]}`;
    }
  }
  const findHTTPS = brand?.data?.brand?.img?.includes("https");
  return (
    <>
      <SEO title={brand?.data?.brand?.title} image={brand?.data?.brand?.img} />
      <SiderHorizontal
        goBack={true}
        address={true}
        searchFilter={true}
        timeRange={true}
        balance={true}
      />
      <div className="brand-header">
        <div className="current-brand">
          <div className="logo">
            {findHTTPS ? (
              <img src={brand?.data?.brand.img} alt="Avatar" />
            ) : brand?.data?.brand.img ? (
              <img
                src={
                  process.env.NEXT_PUBLIC_IMG_BASE_URL + brand?.data?.brand.img
                }
                alt="Avatar"
              />
            ) : (
              <div className="square avatar">
                {brand?.data?.brand.title?.slice(0, 1)}
              </div>
            )}
          </div>
          <div className="name">{brand?.data?.brand.title}</div>
        </div>
      </div>
      <div className="brand-detail">
        <ProductSection title="" total={products.meta?.total} sort={true}>
          {productList?.map((product, key) => (
            <ProductCard key={key} data={product} />
          ))}
          {productList?.length <= 0 && (
            <RiveResult text="Product not found in the brand" />
          )}
          {loader && <ProductLoader />}
          <div ref={lastBookElementRef} />
        </ProductSection>
      </div>
    </>
  );
};
export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const currency_id = cookies?.currency_id;
  const language_locale = cookies?.language_locale;

  try {
    const brandRes = await axiosService.get(`/rest/brands/slug/${query.brandSlug}`, {
      params: { lang: language_locale },
    });
    const productRes = await axiosService.get(`/rest/products/paginate`, {
      params: {
        perPage: 15,
        brand_id: brandRes.data?.data?.brand?.id,
        shop_slug: query.shopSlug,
        currency_id,
        lang: language_locale,
      },
    });
    const brand = await brandRes.data;
    const products = await productRes.data;
    return {
      props: {
        brand,
        products,
        shop_slug: query.shopSlug,
        error: {},
      },
    };
  } catch (error) {
    return {
      props: {
        brand: {},
        products: {},
        error: error,
      },
    };
  }
}
export default BrandDetail;
