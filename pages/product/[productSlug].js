import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import nookies from "nookies";
import SiderHorizontal from "../../components/store-layout/sider-horizontal";
import ProductData from "../../components/products/product-data";
import SEO from "../../components/seo";
import axiosService from "../../services/axios";
import ImgMagnify from "../../components/products/img-magnify";
import Related from "../../components/products/related";
import { ProductApi } from "../../api/main/product";
import ProductStoreData from "../../components/products/store-data";
import { addCurrentStore } from "../../redux/slices/stores";
import { useDispatch } from "react-redux";
import BuyWith from "../../components/products/buyWith";
const Drawer = dynamic(() => import("../../components/drawer"));
const AddReview = dynamic(() => import("../../components/products/add-review"));
function ProductDetail({ productData }) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(productData);
  const dispatch = useDispatch();
  const isGiftCard = productData?.product?.gift === 1;

  console.log(isGiftCard)
  const getProduct = (uuid) => {
    ProductApi.getId(uuid)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    setData(productData);
    if (productData.shop) dispatch(addCurrentStore(productData.shop));
  }, [productData?.id]);
  return (
    <>
      <SEO
        description={productData?.product.translation.description}
        image={process.env.NEXT_PUBLIC_IMG_BASE_URL + productData?.product.img}
        keywords={productData?.product.translation.description}
        title={productData?.product.translation.title}
      />
      <SiderHorizontal
        goBack={true}
        address={true}
        searchFilter={true}
        timeRange={true}
        balance={true}
      />
      <div className="product-detail-wrapper">
        <div className="product-detail">
          <ImgMagnify galleries={data?.product.galleries} product={data} />
          <ProductData setVisible={setVisible} product={data} />
        </div>
        <ProductStoreData setVisible={setVisible} data={data} />
      </div>

        {!isGiftCard &&

            <><Related data={data} />
            <BuyWith productId={data?.id} />
            </>
        }

      <Drawer
        className="add-rating"
        visible={visible}
        setVisible={setVisible}
        title="Rate"
      >
        <AddReview
          getProduct={getProduct}
          product={data}
          setVisible={setVisible}
        />
      </Drawer>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const currency_id = cookies?.currency_id;
  const language_locale = cookies?.language_locale;
  const params = { currency_id, lang: language_locale };
  try {
    const res = await axiosService.get(`/rest/products/slug/${query.productSlug}`, {
      params,
    });
    const productData = await res.data.data;
    return {
      props: {
        productData,
        error: {},
      },
    };
  } catch (error) {
    if(error.statusCode === 'ERROR_404') return {notFound: true};
    return {
      props: {
        data: {},
        error: error,
      },
    };
  }
}
export default ProductDetail;
