import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { createContext, useEffect, useState } from "react";
import { ShopApi } from "../api/main/shops";
import useUserLocation from "../hooks/useUserLocation";
export const ShopContext = createContext();

const ShopContextProvider = ({ children, setLoader }) => {
  const router = useRouter();
  const [page, setPage] = useState(2);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(null);
  const [shopLoader, setShopLoader] = useState(false);
  const cookies = parseCookies();
  const address = useUserLocation(
    cookies.userLocation || process.env.NEXT_PUBLIC_DEFAULT_LOCATION
  );
  const getStore = (params = {}) => {
    setShopLoader(true);
    params["address[latitude]"] = address.latitude;
    params["address[longitude]"] = address.longitude;
    ShopApi.get({ page, ...params })
      .then((res) => {
        if (params.page) {
          setStores(res.data);
        } else {
          setStores([...stores, ...res.data]);
        }
        setTotal(res.meta.total);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setShopLoader(false);
      });
  };
  const handleFilter = (params = {}) => {
    setPage(2);
    params.page = 1;
    getStore(params);
  };
  const searchStore = () => {
    setLoader(true);
    const params = {
      "address[latitude]": address.latitude,
      "address[longitude]": address.longitude,
    };
    ShopApi.search({ search, ...params })
      .then((res) => {
        setStores(res.data);
        setLoader(false);
        setTotal(res.data?.length);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };
  const handleLoadMore = () => {
    setStores([]);
    getStore();
    setPage((prev) => prev + 1);
  };
  const handleCategory = (params) => {
    setStores([]);
    getStore(params);
  };
  useEffect(() => {
    setSearch("");
    setPage(2);
  }, [router.pathname]);

  return (
    <ShopContext.Provider
      value={{
        stores,
        setStores,
        search,
        setSearch,
        page,
        setPage,
        getStore,
        handleFilter,
        handleLoadMore,
        searchStore,
        handleCategory,
        shopLoader,
        total,
        setTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
