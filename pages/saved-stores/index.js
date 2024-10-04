import React, { useMemo, useState } from "react";
import StoreCard from "../../components/stores/card";
import SiderHorizontal from "../../components/store-layout/sider-horizontal";
import SEO from "../../components/seo";
import { useSelector } from "react-redux";
import RiveResult from "../../components/loader/rive-result";
import { useTranslation } from "react-i18next";

function SavedStores() {
  const { t: tl } = useTranslation();
  const [search, setSearch] = useState(null); // Initialize search as null
  const savedStores = useSelector((state) => state.savedStore.savedStoreList);

  const searchStore = () => {
    console.log(search);
  };

  const filteredStores = useMemo(() => {
    if (search === null) {
      return savedStores;
    } else {
      return savedStores.filter((store) =>
        store.translation?.title.toLowerCase().includes(search.toLowerCase())
      );
    }
  }, [search, savedStores]);

  return (
    <>
      <SEO />
      <SiderHorizontal
        searchContent={true}
        categoryFilter={true}
        address={true}
        searchStore={searchStore}
        search={search}
        setSearch={setSearch}
      />
      <div className="content">
        <h3>{tl("Saved stores")}</h3>
        <div className="store">
          {filteredStores.length > 0 ? (
            filteredStores.map((data, key) => (
              <StoreCard key={key} data={data} />
            ))
          ) : (
            <RiveResult
              text={
                search !== null
                  ? "No matching items found in the saved stores"
                  : "There are no items in the saved stores"
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

export default SavedStores;
