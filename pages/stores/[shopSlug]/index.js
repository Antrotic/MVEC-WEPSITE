import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import SEO from "../../../components/seo";
import axiosService from "../../../services/axios";
import ProductLoader from "../../../components/loader/product";
import RiveResult from "../../../components/loader/rive-result";
import { ProductByCategoryApi } from "../../../api/main/product-by-category";
import nookies, { parseCookies } from "nookies";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { OrderContext } from "../../../context/OrderContext";
import { getCategory } from "../../../redux/slices/category";
import { clearGeneralData, getTotals } from "../../../redux/slices/cart";
import GroupLineIcon from "remixicon-react/GroupLineIcon";
import { useTranslation } from "react-i18next";
import { MainContext } from "../../../context/MainContext";
import { toast } from "react-toastify";
import Banner from "../../../components/single-store/banner";
import SiderHorizontal from "../../../components/store-layout/sider-horizontal";
import ProductSection from "../../../components/products/section";
import ProductCard from "../../../components/products/card";
import Category from "../../../components/single-store/category";
import {
  handleVisibleStoreInfo,
  setOpengomodal,
} from "../../../redux/slices/mainState";
import { setRoleId } from "../../../redux/slices/chat";
const Drawer = dynamic(() => import("../../../components/drawer"));
const Brand = dynamic(() => import("../../../components/single-store/brand"));
const StoreInfo = dynamic(() =>
  import("../../../components/single-store/store-info")
);
const DeliveryTime = dynamic(() =>
  import("../../../components/single-store/delivery-time")
);
const StoreRate = dynamic(() =>
  import("../../../components/single-store/store-rate")
);
const BannerCard = dynamic(() =>
  import("../../../components/single-store/banner-card")
);
function SingleStore({ storeDetail }) {
  const cookies = parseCookies();
  const { handleAuth } = useContext(MainContext);
  const dispatch = useDispatch();
  const { t: tl } = useTranslation();
  const [meta, setMeta] = useState({ current_page: 1 });
  const [loader, setLoader] = useState(false);
  const observer = useRef();
  const { current_page, last_page } = meta;
  const [categoryBlog, setCategoryBlog] = useState(null);
  const [openContent, setOpenContent] = useState("store-delivery");
  const { fetchCart } = useContext(OrderContext);
  const { generalData } = useSelector((state) => state.cart, shallowEqual);
  const { visibleStoreInfo: visible } = useSelector(
    (state) => state.mainState,
    shallowEqual
  );
  const openDrawer = (name) => {
    dispatch(handleVisibleStoreInfo(true));
    setOpenContent(name);
  };
  const getProductByCategory = (perPage = 3, page = 1) => {
    setLoader(true);
    ProductByCategoryApi.get({
      page,
      perPage,
      shop_id: storeDetail?.id,
    })
      .then((res) => {
        setMeta(res.meta);
        if (categoryBlog) setCategoryBlog((prev) => [...prev, ...res.data]);
        else setCategoryBlog(res.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getProductByCategory(3, current_page);
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

  useEffect(() => {
    if (cookies?.access_token && !cookies?.cart_id) fetchCart();
    batch(() => {
      dispatch(getTotals(storeDetail?.id));
      dispatch(setRoleId(storeDetail?.id));
      dispatch(
        getCategory({
          lang: cookies.language_locale,
          shop_id: storeDetail?.id,
          perPage: 1500,
        })
      );
    });
    if (storeDetail?.id !== generalData?.shop_id) {
      dispatch(clearGeneralData());
    }
  }, []);

  const handleTogether = () => {
    const cookie = parseCookies();
    if (cookie.access_token || cookie.cart_id) dispatch(setOpengomodal(true));
    else {
      toast.error("Please login first");
      handleAuth("login");
    }
  };

  return (
    <>
      <SEO
        description={storeDetail?.translation?.description}
        image={process.env.NEXT_PUBLIC_IMG_BASE_URL + storeDetail?.logo_img}
        keywords={storeDetail?.translation?.description}
        title={storeDetail?.translation?.title}
      />
      <SiderHorizontal
        goBack={true}
        address={true}
        searchFilter={true}
        timeRange={true}
        balance={true}
      />
      <Banner
        setVisible={openDrawer}
        data={storeDetail}
        handleTogether={handleTogether}
      />
      <BannerCard shop_id={storeDetail?.id} />
      <div className='together-wrapper'>
        <div className='together-order' onClick={handleTogether}>
          <GroupLineIcon className='icon' size={20} />
          <div className='label'>{tl("Together order")}</div>
        </div>
        <Category shopSlug={storeDetail.slug} shop_id={storeDetail?.id} />
      </div>
      <div className='products_row'>
        {categoryBlog &&
          categoryBlog?.map((data, key) => (
            <ProductSection
              key={key}
              title={data.translation.title}
              to={`/stores/${storeDetail.slug}/all-product-by-category/${data.slug}`}
            >
              {data.shop_product?.map((item) => (
                <ProductCard
                  isGiftCard={!!item?.product?.gift}
                  key={item.id}
                  data={item}
                />
              ))}
              <div ref={lastBookElementRef} />
            </ProductSection>
          ))}
      </div>
      {loader && (
        <>
          <ProductSection>
            <ProductLoader />
          </ProductSection>
          <ProductSection>
            <ProductLoader />
          </ProductSection>
        </>
      )}
      {categoryBlog?.length <= 0 && (
        <ProductSection>
          <RiveResult text='No products found in this shop' />
        </ProductSection>
      )}
      <Brand storeDetail={storeDetail} />
      <Drawer
        title='Store info'
        visible={visible}
        setVisible={() => dispatch(handleVisibleStoreInfo())}
      >
        {openContent === "store-info" && (
          <StoreInfo setOpenContent={setOpenContent} />
        )}
        {openContent === "store-delivery" && <DeliveryTime />}
        {openContent === "rating" && <StoreRate />}
      </Drawer>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const currency_id = cookies?.currency_id;
  const params = { perPage: 0, page: 1, lang: language_locale, currency_id };
  try {
    const res = await axiosService.get(
      `/rest/shops/by-slug/${query.shopSlug}`,
      {
        params,
      }
    );
    const storeDetail = res.data.data;
    return {
      props: {
        storeDetail,
        error: {},
      },
    };
  } catch (error) {
    return {
      props: {
        storeDetail: {},
        error: error,
      },
    };
  }
}

export default SingleStore;
