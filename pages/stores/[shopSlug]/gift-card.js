import {useRouter} from "next/router";
import React, {useEffect, useRef, useState} from "react";
import {ProductApi} from "../../../api/main/product";
import SEO from "../../../components/seo";
import SiderHorizontal from "../../../components/store-layout/sider-horizontal";
import ProductSection from "../../../components/products/section";
import ProductCard from "../../../components/products/card";
import RiveResult from "../../../components/loader/rive-result";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import ProductSkeleton from "../../../components/skeleton/product-skeleton";

const GiftCards = ({initialList =[], initialMeta}) => {

    const router = useRouter();
    const ref = useRef();
    const {entry, unobserve} = useIntersectionObserver(ref, {})
    const [list, setList] = useState(initialList);
    const [meta, setMeta] = useState(initialMeta);

    const [loadingGiftsCount, setLoadingGiftsCount] = useState(0)
    const getProduct = () => {
        if (!router.query.shopSlug) return;
        if (list.length >= meta.total) {
            return unobserve();
        }
        const unloadedItemsCount = Math.min(meta.total - list.length, meta.per_page);

        setLoadingGiftsCount(unloadedItemsCount)
        ProductApi.get({
            perPage: meta.per_page,
            page: meta.current_page + 1,
            shop_slug: router.query.shopSlug,
            gift: 1
        })
            .then((response) => {

                setMeta(response.meta)
                setList(prevState => ([...prevState, ...response.data]))
            })
            .catch((error) => {
                console.error(error);
            }).finally(() => setLoadingGiftsCount( 0));
    };
    useEffect(() => {
        if (entry?.isIntersecting) getProduct();
    }, [entry?.isIntersecting, list.length]);

    return (<>
        <SEO/>
        <SiderHorizontal
            goBack={true}
            address={true}
            searchFilter={true}
            timeRange={true}
            balance={true}
        />
        <ProductSection title="Gift cards">
            {list.map((data, key) => <ProductCard isGiftCard key={key} data={data}/>)}
            <div ref={ref}/>
            {Array(Number(loadingGiftsCount)).fill(1).map((_, idx) => <ProductSkeleton key={idx}/>)}
            {list?.length === 0 && <RiveResult text="Product not found"/>}
        </ProductSection>
    </>);
};

export async function getServerSideProps(ctx) {
    const {shopSlug} = ctx.params;
    try {
        const res = await ProductApi.get({
            perPage: 10, page: 1, shop_slug: shopSlug, gift: 1
        });

        return {props: {initialList: res.data, initialMeta: res.meta}}
    } catch (error) {

    }
}

export default GiftCards;