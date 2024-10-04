import React from "react";
import Link from "next/link";
import { BurgerOutline } from "../../../public/assets/images/svg";
import Menu from "../menu";
import UserData from "./components/UserData";
import { useTranslation } from "react-i18next";
import { shallowEqual, useSelector } from "react-redux";
function Sider() {
  const { t: tl } = useTranslation();
  const settings = useSelector((state) => state.settings.data, shallowEqual);
  return (
    <>
      <div className="sider">
        <div className="sider-header">
          <div className="burger-btn">
            <BurgerOutline />
          </div>
          <Link href="/" className="logo">
            {settings?.title || "Company logo"}
          </Link>
        </div>
        <div className="sider-content">
          <UserData />
          <Menu />
        </div>
      </div>
    </>
  );
}

export default Sider;
