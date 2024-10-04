import React, { useState } from "react";
import nookies from "nookies";
import { BrandApi } from "../../../../api/main/brand";
import axiosService from "../../../../services/axios";
import SEO from "../../../../components/seo";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import BrandCard from "../../../../components/brands";
import ProductSection from "../../../../components/products/section";
import { useRouter } from "next/router";

const AllBrand = ({ setLoader, data: { data, meta } }) => {
  const [brandList, setBrandList] = useState(data);
  const [metaData, setMeta] = useState(meta);
  const { current_page, last_page, total } = metaData || {};
  const {
    query: { shopSlug },
  } = useRouter();

  const getBrand = (perPage = 12, page = 1, sort = "asc") => {
    BrandApi.get({ perPage, page, sort, shop_id: shopSlug })
      .then(({ data, meta }) => {
        setMeta(meta);
        setBrandList([...brandList, ...data]);
        setLoader(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePaginate = () => {
    setLoader(true);
    getBrand(12, current_page + 1);
  };

  const handleSort = (sort) => {
    setLoader(true);
    BrandApi.get({ perPage: 12, page: 1, sort })
      .then(({ data, meta }) => {
        setLoader(false);
        setMeta(meta);
        setBrandList(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
      <div className="all-brand">
        <ProductSection
          handleSort={handleSort}
          total={total}
          title="All Brands"
          sort={brandList?.length ? true : false}
        >
          {brandList
            ? brandList.map((data, key) => {
                return <BrandCard key={key} data={data} />;
              })
            : ""}
        </ProductSection>
        {last_page > current_page && (
          <div onClick={handlePaginate} className="see-more">
            {"Load more"}
          </div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const {
    query: { shopSlug },
  } = ctx;
  const language_locale = cookies?.language_locale;
  const params = { perPage: 12, page: 1, lang: language_locale, shop_slug: shopSlug };

  try {
    const res = await axiosService.get("/rest/brands/paginate", {
      params,
    });
    const data = await res.data;
    return {
      props: {
        data,
        error: {},
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
export default AllBrand;
