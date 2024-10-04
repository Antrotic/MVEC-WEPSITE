import { useEffect, useMemo, useState } from "react";
import HomeLayout from "../layouts/home-layout";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import i18n from "../services/i18next";
import MainProvider from "../components/provider";
import StoreLayout from "../layouts/store-layout";
import informationService from "../services/informationService";
import useSettings from "../hooks/useSettings";
import "react-toastify/dist/ReactToastify.css";
import "../styles/index.scss";
import "nprogress/nprogress.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/bundle";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import "rc-slider/assets/index.css";
import "rc-pagination/assets/index.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "../services/i18next";

const homeRoutes = [
  "all-store",
  "view-in-map",
  "/faq",
  "/term-of-use",
  "/privacy-policy",
  "/contact",
  "/about",
  "/referrals",
  "/referral-terms",
  "/parcel-checkout",
];
function MyApp({ Component, pageProps }) {
  const cookie = parseCookies();
  const router = useRouter();
  const [loader, setLoader] = useState(null);
  const {
    settings: { primary_color },
  } = useMemo(() => useSettings(), [useSettings()]);

  const isHomeLayout = homeRoutes.find(
    (item) => router.pathname.includes(item) || router.pathname === "/"
  );
  function fetchTranslations() {
    const lang = cookie.language_locale || "en";
    const params = {
      lang,
    };
    informationService.translations(params).then(({ data }) => {
      i18n.addResourceBundle(lang, "translation", data.data);
      i18n.changeLanguage(lang);
    });
  }

  useEffect(() => {
    fetchTranslations();
    let r = document.querySelector(":root");
    r.style.setProperty("--green", primary_color || "#16aa16");
  }, []);

  return (
    <MainProvider loader={loader} setLoader={setLoader}>
      {isHomeLayout ? (
        <HomeLayout>
          <Component setLoader={setLoader} {...pageProps} />
        </HomeLayout>
      ) : (
        <StoreLayout>
          <Component setLoader={setLoader} {...pageProps} />
        </StoreLayout>
      )}
    </MainProvider>
  );
}

export default MyApp;
