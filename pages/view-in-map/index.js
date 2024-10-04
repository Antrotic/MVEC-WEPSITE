import React from "react";
import GoogleMap from "../../components/map";
import SEO from "../../components/seo";
import Store from "../../components/view-in-map/stores";
import { useContext } from "react";
import { useEffect } from "react";
import StoreFilter from "../../components/home/helper/StoreFilter";
import { ShopContext } from "../../context/ShopContext";
import { parseCookies } from "nookies";

function ViewInMap() {
  const userLocation = parseCookies()?.userLocation;
  const { stores, search, setSearch, handleFilter, searchStore, getStore } =
    useContext(ShopContext);

  useEffect(() => {
    getStore();
  }, [userLocation]);

  return (
    <>
      <SEO />
      <div className="container">
        <StoreFilter
          handleFilter={handleFilter}
          searchStore={searchStore}
          search={search}
          setSearch={setSearch}
        />
      </div>
      <div className="all_store_location">
        <Store stores={stores} />
        <GoogleMap stores={stores} />
      </div>
    </>
  );
}

export default ViewInMap;
