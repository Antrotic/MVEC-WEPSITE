import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { shallowEqual, useSelector } from "react-redux";
import CartLoader from "../components/loader/cart-loader";
const Header = dynamic(() => import("../components/header"));
const Address = dynamic(() => import("../components/address-modal/Address"));
export default function HomeLayout({ children }) {
  const { error, loading } = useSelector(
    (state) => state.settings,
    shallowEqual
  );

  useEffect(() => {
    if (error) console.log(error);
  }, []);

  // if (loading) {
  //   return <CartLoader />;
  // }

  return (
    <>
      <Header />
      {children}
      <Address />
    </>
  );
}
