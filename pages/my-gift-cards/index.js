import SiderHorizontal from "../../components/store-layout/sider-horizontal";
import SEO from "../../components/seo";
import ProductSection from "../../components/products/section";
import RiveResult from "../../components/loader/rive-result";
import {UserApi} from "../../api/main/user";
import MyGiftCard from "../../components/my-giftCard";
import {parseCookies} from "nookies";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import {useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import ProductSkeleton from "../../components/skeleton/product-skeleton";

function MyGiftCards({initialGiftCards = [], initialMeta}) {
    const ref = useRef();
    const {entry, unobserve} = useIntersectionObserver(ref, {});
    const [meta, setMeta] = useState(initialMeta);
    const [giftCards, setGiftCards] = useState(initialGiftCards);
    const [loadingGiftsCount, setLoadingGiftsCount] = useState(0)
    const fetchGiftCards = async () => {
        if (giftCards.length >= meta.total) {
            return unobserve();
        }
        const unloadedItemsCount = Math.min(meta.total - giftCards.length, meta.per_page);
        setLoadingGiftsCount(unloadedItemsCount)
        try {
            const res = await UserApi.myGiftCards(
                {
                    perPage: meta.per_page,
                    page: meta.current_page + 1,
                }
            );
            setLoadingGiftsCount( 0)
            setMeta(res.meta)
            setGiftCards(prevState => ([...prevState, ...res.data]))
        } catch (e) {
            console.error(e)
            toast.error(e.message)
        } finally {
            setLoadingGiftsCount( 0)
        }
    }

    useEffect(() => {
        if (entry?.isIntersecting) fetchGiftCards().then();
    }, [entry?.isIntersecting, giftCards.length]);
    return (
        <>
            <SEO/>
            <SiderHorizontal goBack={true}/>
            <ProductSection title='My gift cards'>
                {giftCards?.map?.((data) => (
                    <MyGiftCard key={data?.id} data={data}/>
                ))}
                <div ref={ref}/>
                {Array(Number(loadingGiftsCount)).fill(1).map((_, idx) => <ProductSkeleton key={idx}/>)}
                {giftCards?.length === 0 && (
                    <RiveResult text='There are no gift cards'/>
                )}
            </ProductSection>
        </>
    );
}

export async function getServerSideProps({req}) {
    const {access_token} = parseCookies({req});
    try {
        const res = await UserApi.myGiftCards(
            {
                perPage: 10,
                page: 1,
            },
            access_token
        );
        return {props: {initialGiftCards: res?.data, initialMeta: res?.meta}};
    } catch (error) {
        return {props: {giftCards: "error"}};
    }
}

export default MyGiftCards;
