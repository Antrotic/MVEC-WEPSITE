import Footer from "../components/footer";
import AboutCompany from "../components/home/AboutCompany";
import Deliveries from "../components/home/Deliveries";
import GroceryDelivery from "../components/home/GroceryDelivery";
import SeeMapMobile from "../components/home/SeeMapMobile";
import Store from "../components/home/Store";
import SEO from "../components/seo";
import axiosService from "../services/axios";
import { useEffect } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { shallowEqual, useSelector } from "react-redux";
import Banner from "../components/banner/store";
import nookies from "nookies";
import ParcelCard from "../components/home/ParcelBanner";

const Home = ({ shopsList = [], error }) => {
  const bannerList = useSelector((state) => state.banners.data, shallowEqual);
  const { setStores } = useContext(ShopContext);
  const settings = useSelector((state) => state.settings.data);
  const activeParcel = Number(settings?.active_parcel) === 1;
  
  useEffect(() => {
    setStores(shopsList.data || []);
  }, [shopsList]);

  return (
    <div className="home">
      <SEO />
      <Banner bannerList={bannerList} />
      <SeeMapMobile />
      <Store filter={true} totalCount={shopsList?.meta?.total} />
      {activeParcel && <ParcelCard />}
      <GroceryDelivery />
      <AboutCompany />
      {/* <Deliveries /> */}
      <Footer />
    </div>
  );
};
export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const currency_id = cookies?.currency_id;
  const address = {
    latitude: (
      cookies.userLocation || process.env.NEXT_PUBLIC_DEFAULT_LOCATION
    ).split(",")[0],
    longitude: (
      cookies.userLocation || process.env.NEXT_PUBLIC_DEFAULT_LOCATION
    ).split(",")[1],
  };

  const params = {
    page: 1,
    perPage: 8,
    lang: language_locale,
    currency_id,
  };
  params["address[latitude]"] = address.latitude?.trim();
  params["address[longitude]"] = address.longitude?.trim();
  try {
    const res = await axiosService.get("/rest/shops/paginate", {
      params,
    });
    const shopsList = await res.data;
    return {
      props: {
        shopsList,
        error: {},
      },
    };
  } catch (error) {
    return {
      props: {
        data: {},
        error: error?.response?.data,
      },
    };
  }
}
export default Home;
