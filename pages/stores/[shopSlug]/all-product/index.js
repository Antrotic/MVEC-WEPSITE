import React, {useEffect, useRef, useState} from "react";
import ProductSection from "../../../../components/products/section";
import ProductCard from "../../../../components/products/card";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import SEO from "../../../../components/seo";
import {ProductApi} from "../../../../api/main/product";
import RiveResult from "../../../../components/loader/rive-result";
import ProductLoader from "../../../../components/loader/product";
import {useRouter} from "next/router";
import useIntersectionObserver from "../../../../hooks/useIntersectionObserver";
import ProductSkeleton from "../../../../components/skeleton/product-skeleton";

const AllProductByCategory = ({initialList = [], initialMeta}) => {
    const router = useRouter();
    const ref = useRef();
    const meta = useRef(initialMeta);
    const {entry, unobserve} = useIntersectionObserver(ref, {});
    const [loadingCartCount, setLoadingCartCount] = useState(0);
    const [list, setList] = useState(initialList);

    const getProduct = (newQuery) => {
        if (!router.query.shopSlug) return;
        if (!newQuery && list.length >= meta.current.total) {
            return unobserve();
        }
        const unloadedCartCount = Math.min(meta.current.total - list.length, meta.current.per_page);
        setLoadingCartCount(unloadedCartCount);

        ProductApi.get({
            category_id: router.query.category_id,
            column_price: router.query.column_price,
            page: newQuery ? 0 : meta.current.current_page + 1,
            perPage: meta.current.per_page,
            price_from: router.query.price_from,
            price_to: router.query.price_to,
            shop_slug: router.query.shopSlug,
            sort: router.query.sort,
        })
            .then((response) => {
                newQuery ? setList(response.data) : setList((prev) => ([...prev, ...response.data]));
                meta.current = response.meta;
            })
            .catch((error) => {
            }).finally(() => {
            setLoadingCartCount(0)
        });
    };

    useEffect(() => {
        if (entry.isIntersecting && list.length < meta.current.total) {
            getProduct()
        }
        // getProduct();
    }, [entry.isIntersecting, list.length]);

    useEffect(() => {
        if(ref) {
            getProduct(true)
        }
    }, [router.query]);

    return (<>
        <SEO/>
        <SiderHorizontal
            goBack={true}
            address={true}
            searchFilter={true}
            timeRange={true}
            balance={true}
        />
        <div className="category">
            {/* <div className="name">{categoryDetail?.translation.title}</div> */}
            {/* <div className="items">
          {categoryDetail?.children.map((item) => (
            <div
              key={item.uuid}
              className={`item ${
                currentCategory?.id === item?.id ? "active" : ""
              }`}
              onClick={() => handleCategory(item)}
            >
              <img src={process.env.NEXT_PUBLIC_IMG_BASE_URL + item?.img} alt="children" />
              <div className="name">{item?.translation?.title}</div>
            </div>
          ))}
        </div> */}
        </div>
        <ProductSection title="">
            {list.map((data, key) => <ProductCard key={key} data={data}/>)}
            <div ref={ref}/>
            {Array(Number(loadingCartCount || 0)).fill(1).map((_, idx) => <ProductSkeleton key={idx}/>)}
            {list?.length === 0 && <RiveResult text="Product not found"/>}
        </ProductSection>
    </>);
};

export async function getServerSideProps(clx) {
    const {query} = clx;
    try {
        const {data, meta} = await ProductApi.get({
            perPage: 10,
            page: 1,
            category_id: query.category_id,
            shop_slug: query.shopSlug,
            price_from: query.price_from,
            price_to: query.price_to,
            sort: query.sort,
            column_price: query.column_price,
        })

        return {
            props: {
                initialList: data, initialMeta: meta
            }
        }
    } catch (e) {
        return {props: {error: true}}
    }

}

export default AllProductByCategory;
