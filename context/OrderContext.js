import { useRouter } from "next/router";
import { destroyCookie, parseCookies } from "nookies";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CartApi } from "../api/main/cart";
import {
  addToCart,
  clearAllCart,
  decreaseCart,
  getTotals,
  removeFromCart,
  setMember,
  setToCart,
} from "../redux/slices/cart";
import useDebounce from "../hooks/useDebounce";
import { MainContext } from "./MainContext";
import { setIsOpenConfirm, setOpengomodal } from "../redux/slices/mainState";
import { findObjectByProductId } from "../utils/findObjectByProductId";
export const OrderContext = createContext();

const OrderContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const router = useRouter();
  const { t: tl } = useTranslation();
  const { handleAuth } = useContext(MainContext);
  const [listener, setListener] = useState(null);
  const [cartLoader, setCartLoader] = useState(null);
  const [shopProduct, setShopProduct] = useState({});
  const [orderedProduct, setOrderedProduct] = useState(null);
  const debouncedCounterTerm = useDebounce(listener, 500);
  const cart = useSelector((state) => state.cart, shallowEqual);
  const shop = useSelector((state) => state.stores.currentStore, shallowEqual);
  const memberData = useSelector(
    (state) => state.cart.memberData,
    shallowEqual
  );
  const cartData = useSelector((state) => state.cart.cartData, shallowEqual);
  const currency_id = cookies.currency_id;
  const cart_id = cookies.cart_id;
  const shop_id = router.query.id ? router.query.id : shop?.id;

  const clearMemberData = () => {
    batch(() => {
      dispatch(setMember({}));
      dispatch(clearAllCart());
      dispatch(setOpengomodal(false));
      dispatch(getTotals(memberData?.shop_id));
    });
    destroyCookie(null, "cart_id", { path: "/" });
    destroyCookie(null, "shop_id", { path: "/" });
  };
  const setCart = (data) => {
    if (data?.length === 0) dispatch(setToCart([]));
    const newData = data?.userCarts?.flatMap((element) => element.cartDetails);

    const newData2 = newData?.flatMap((element) => [
      {
        qty: element.quantity,
        ...element.shopProduct,
        user_cart_uuid: element.user_cart_uuid,
      },
    ]);
    if (newData2) dispatch(setToCart(newData2));
  };
  const getCart = () => {
    setCartLoader(true);
    CartApi.get({ shop_id: cartData?.shop_id ? cartData?.shop_id : shop?.id })
      .then((res) => {
        setCart(res.data || []);
        setOrderedProduct(res.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setCartLoader(false);
      });
  };
  const getCartMember = () => {
    setCartLoader(true);
    CartApi.getMember({
      shop_id: memberData?.shop_id,
      id: cart_id,
      user_cart_uuid: memberData?.uuid,
    })
      .then((res) => {
        const currentMemberCard = res.data.userCarts?.filter(
          (item) => item.uuid === memberData?.uuid
        );
        setCart({ userCarts: currentMemberCard } || []);
        setOrderedProduct(res.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.status === 404) {
          clearMemberData();
          toast.warn("You removed by owner or group order deleted by owner");
          router.push("/");
        }
      })
      .finally(() => {
        setCartLoader(false);
      });
  };
  const getCurrentProduct = (data) => {
    const currentProduct = cart.cartItems.find((item) => item?.id === data?.id);
    return currentProduct;
  };
  const decrease = (data) => {
    setShopProduct(data);
    const c_p = getCurrentProduct(data);
    if (c_p.qty == c_p.min_qty || c_p.qty - 1 <= 0) {
      toast.warn("Cannot be further decreased");
    } else {
      setListener({ qty: c_p.qty - 1, id: data.id });
      batch(() => {
        dispatch(decreaseCart({ ...data, shop }));
        dispatch(getTotals(shop?.id));
      });
    }
  };
  const increase = (data) => {
    setShopProduct(data);
    const currentProduct = getCurrentProduct(data);
    if (
      currentProduct.qty >= currentProduct?.max_qty ||
      currentProduct.qty >= currentProduct?.quantity
    ) {
      toast.warn(
        `${tl("You can buy only")} ${
          data.max_qty > data?.quantity ? data?.quantity : data.max_qty
        } ${tl("products")}`
      , {toastId: 1});
    } else {
      setListener({ qty: currentProduct.qty + 1, id: data.id });
      dispatch(addToCart(data));
    }
    dispatch(getTotals(shop?.id));
  };
  const handleAddToCart = (product) => {
    const cookies = parseCookies();
    if (
      (memberData?.id && memberData?.shop_id != shop_id) ||
      (cartData?.id && cartData?.shop_id != shop_id)
    ) {
      dispatch(setIsOpenConfirm(true));
    } else if (cookies.access_token || cart_id) {
      setShopProduct(product);
      setListener({ qty: product?.min_qty, id: product.id });
      batch(() => {
        dispatch(addToCart({ ...product, shop }));
        dispatch(getTotals(shop?.id));
      });
    } else {
      toast.error("Please login first");
      handleAuth("login");
    }
  };
  const handleError = (error) => {
    console.log(error);
    dispatch(removeFromCart(shopProduct));
    toast.error(error.response?.data.message);
  };
  const fetchCart = () => {
    if (cart_id) getCartMember();
    else getCart();

    dispatch(getTotals(shop?.id));
  };

  const addToServerCart = () => {
    setCartLoader(true);
    if (cart_id) {
      CartApi.memberCreate({
        cart_id,
        shop_id: shop?.id,
        quantity: listener?.qty,
        shop_product_id: shopProduct.id,
        user_cart_uuid: memberData.uuid,
        currency: currency_id,
      })
        .then((res) => {
          setOrderedProduct(res.data);
        })
        .catch((error) => {
          handleError(error);
        })
        .finally(() => {
          setCartLoader(false);
        });
    } else if (cookies.access_token)
      CartApi.create({
        shop_id: shop?.id,
        shop_product_id: shopProduct.id,
        quantity: listener?.qty,
        currency: currency_id,
        user_cart_uuid: shopProduct.user_cart_uuid,
      })
        .then((res) => {
          setCart(res.data);
          setOrderedProduct(res.data);
        })
        .catch((error) => {
          handleError(error);
        })
        .finally(() => {
          setCartLoader(false);
        });
  };
  useEffect(() => {
    if (debouncedCounterTerm) addToServerCart();
  }, [debouncedCounterTerm]);

  return (
    <OrderContext.Provider
      value={{
        decrease,
        increase,
        handleAddToCart,
        getCart,
        getCartMember,
        setOrderedProduct,
        clearMemberData,
        orderedProduct,
        listener,
        fetchCart,
        cartLoader,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;
