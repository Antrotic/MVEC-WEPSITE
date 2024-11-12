import React, {useContext, useEffect, useState} from 'react';
import SiderHorizontal from '../../components/store-layout/sider-horizontal';
import SEO from '../../components/seo';
import axiosService from '../../services/axios';
import StoreCard from '../../components/stores/card';
import RiveResult from '../../components/loader/rive-result';
import {ShopContext} from '../../context/ShopContext';
import nookies from 'nookies';
import {useTranslation} from 'react-i18next';
import {ShopApi} from '../../api/main/shops';
import MyLoader from '../../components/loader/category-loader';
import StoreCategory from '../../components/stores/category';
import StoreSkeleton from '../../components/skeleton/store-skeleton';
import {Grid, Skeleton, useMediaQuery} from '@mui/material';

function Stores({shopsList = []}) {
  const {t: tl} = useTranslation();
  const isDesktop = useMediaQuery('(min-width:1140px)');

  const {
    stores,
    setStores,
    search,
    setSearch,
    handleFilter,
    searchStore,
    handleCategory,
    shopLoader,
  } = useContext(ShopContext);
  const [category, setCategory] = useState(null);
  const getCategory = () => {
    ShopApi.getCategory()
      .then(res => {
        setCategory(res.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    setStores(shopsList.data);
    getCategory();
  }, []);
  return (
    <>
      <SEO />
      <SiderHorizontal
        searchContent={true}
        categoryFilter={true}
        address={true}
        handleFilter={handleFilter}
        searchStore={searchStore}
        setSearch={setSearch}
        search={search}
      />
      {category ? (
        <div className="together-wrapper">
          <StoreCategory
            handleCategory={handleCategory}
            categoryList={category}
          />
        </div>
      ) : (
        <div className="store-category">
          <MyLoader />
        </div>
      )}
      <div className="store">
        <h3>{tl('Stores')}</h3>
        <div className="store">
          <Grid container spacing={isDesktop ? 4 : 2}>
            {shopLoader ? (
              <StoreSkeleton />
            ) : (
              stores?.map((item, key) => (
                <Grid key={item.id} item xs={12} sm={6} lg={3}>
                  <StoreCard key={key} data={item} />
                </Grid>
              ))
            )}
            {stores?.length <= 0 && !shopLoader && (
              <RiveResult text="Shop not found" />
            )}
          </Grid>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const currency_id = cookies?.currency_id;
  const address = {
    latitude: (
      cookies.userLocation || process.env.NEXT_PUBLIC_DEFAULT_LOCATION
    ).split(',')[0],
    longitude: (
      cookies.userLocation || process.env.NEXT_PUBLIC_DEFAULT_LOCATION
    ).split(',')[1],
  };
  const params = {
    page: 1,
    perPage: 15,
    lang: language_locale,
    currency_id,
  };
  params['address[latitude]'] = address.latitude;
  params['address[longitude]'] = address.longitude;
  try {
    const res = await axiosService.get(`/rest/shops/paginate`, {
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
        error: error,
      },
    };
  }
}
export default Stores;
