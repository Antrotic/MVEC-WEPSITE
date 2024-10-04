import { useState } from "react";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ShopApi } from "../../api/main/shops";
import { ShopContext } from "../../context/ShopContext";
import MyLoader from "../loader/category-loader";
import RiveResult from "../loader/rive-result";
import StoreSkeleton from "../skeleton/store-skeleton";
import StoreCard from "../stores/card";
import StoreCategory from "../stores/category";
import StoreFilter from "./helper/StoreFilter";
import { useCallback } from "react";

const Store = ({ filter, totalCount }) => {
  const { t: tl } = useTranslation();
  const {
    stores,
    handleFilter,
    search,
    setSearch,
    searchStore,
    handleLoadMore,
    shopLoader,
    total,
    setTotal,
    handleCategory,
  } = useContext(ShopContext);
  const [category, setCategory] = useState(null);
  const [isMounted, setIsMounted] = useState(true);

  const getCategory = useCallback(() => {
    ShopApi.getCategory()
      .then((res) => {
        if (isMounted) setCategory(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setTotal(totalCount);
    getCategory();

    return () => {
      setIsMounted(false);
    };
  }, [getCategory]);

  return (
    <div className="container">
      {filter && (
        <StoreFilter
          handleFilter={handleFilter}
          setSearch={setSearch}
          search={search}
          searchStore={searchStore}
        />
      )}
      {category ? (
        <>
          <div className="title-category">Category</div>
          <div className="together-wrapper">
            <StoreCategory
              handleCategory={handleCategory}
              categoryList={category}
            />
          </div>
        </>
      ) : (
        <div className="store-category">
          <MyLoader />
        </div>
      )}
      <div className="store">
        {stores?.map((data) => (
          <StoreCard key={data.uuid} data={data} />
        ))}
        {shopLoader && (
          <>
            <StoreSkeleton />
            <StoreSkeleton />
          </>
        )}
        {stores?.length <= 0 && !shopLoader && (
          <RiveResult text="Shop not found" />
        )}
      </div>
      {total > 0 && total > stores?.length && stores?.length > 0 && (
        <div className="view_all" onClick={handleLoadMore}>
          {tl("Load more")}
        </div>
      )}
    </div>
  );
};

export default Store;
