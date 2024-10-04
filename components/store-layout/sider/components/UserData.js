import React, { useContext, useState } from "react";
import Link from "next/link";
import Settings3LineIcon from "remixicon-react/Settings3LineIcon";
import Notification2LineIcon from "remixicon-react/Notification2LineIcon";
import RestartLineIcon from "remixicon-react/RestartLineIcon";
import SendPlaneFillIcon from "remixicon-react/SendPlaneFillIcon";
import { images } from "../../../../constants/images";
import { MainContext } from "../../../../context/MainContext";
import { DrawerConfig } from "../../../../configs/drawer-config";
import { useRouter } from "next/router";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getPrice } from "../../../../utils/getPrice";
import { useTranslation } from "react-i18next";
import { Tooltip } from "reactstrap";
import { UserApi } from "../../../../api/main/user";
import { savedUser } from "../../../../redux/slices/user";
import { useEffect } from "react";
import { fetchNotificationStats } from "../../../../redux/slices/notification";
import AddCircleFillIcon from "remixicon-react/AddCircleFillIcon";
import RefundLineIcon from 'remixicon-react/RefundLineIcon'

function UserData({ closeNavbar = () => {} }) {
  const dc = DrawerConfig;
  const { t: tl } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { handleVisible, getUser } = useContext(MainContext);
  const user = useSelector((state) => state.user.data);
  const isEmpty = Object.keys(user).length === 0;
  const findHTTPS = user?.img?.includes("https");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const { notificationStats } = useSelector(
    (state) => state.notificationList,
    shallowEqual
  );

  useEffect(() => {
    let intervalId;
    if (Object.keys(user).length) {
      intervalId = setInterval(
        () => dispatch(fetchNotificationStats({ type: "notification" })),
        10000
      );
    }

    return () => clearInterval(intervalId);
  }, []);

  const reloadWallet = () => {
    setLoading(true);
    UserApi.get()
      .then((res) => {
        dispatch(savedUser(res.data));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      {!isEmpty ? (
        <div className="user-box">
          <div className="img-box">
            <Link href="/settings/site-settings">
              <a
                className={
                  router.pathname === "/settings/site-settings"
                    ? "setting active"
                    : "setting"
                }
              >
                <Settings3LineIcon onClick={() => closeNavbar(false)} />
              </a>
            </Link>
            <div className="avatar">
              {findHTTPS ? (
                <img src={user.img} alt="Avatar" />
              ) : user.img ? (
                <img
                  src={process.env.NEXT_PUBLIC_IMG_BASE_URL + user.img}
                  alt="Avatar"
                />
              ) : (
                <img src={images.Avatar} alt="Avatar" />
              )}
            </div>
            <div
              className="notification"
              onClick={() => handleVisible(dc.notification)}
            >
              <Notification2LineIcon />
              <span className="notification-badge">
                {notificationStats.notification || 0}
              </span>
            </div>
          </div>
          <div className="name-box">
            <div className="name">{`${user.firstname} ${user.lastname}`}</div>
            <div className="phone">{user.phone}</div>
          </div>
          <div className="wallet-balance">
            <div>
              <div className="title">{tl("Wallet balance")}</div>
              <div className="balance" id="TooltipExample">
                {getPrice(user.wallet?.price)}
              </div>
              <Tooltip
                isOpen={tooltipOpen}
                target="TooltipExample"
                toggle={toggle}
              >
                {getPrice(user.wallet?.price)}
              </Tooltip>
            </div>
            <div
              className={isLoading ? "plus-icon spin" : "plus-icon"}
              onClick={reloadWallet}
            >
              <RestartLineIcon />
            </div>
          </div>
          {/* <div
            className="share-wallet"
            onClick={() => handleVisible(dc.share_wallet)}
          >
            <div className="icon">
              <SendPlaneFillIcon />
            </div>
            <div className="name">{tl("Share wallet")}</div>
          </div> */}
          <div
            className="add-wallet"
            onClick={() => handleVisible(dc.top_up_wallet)}
          >
            <div className="icon">
              <AddCircleFillIcon />
            </div>
            <div className="name">{tl("TopUp wallet")}</div>
          </div>
          <div
            className="request-wallet"
            onClick={() => handleVisible(dc.request_money)}
          >
            <div className="icon">
              <RefundLineIcon />
            </div>
            <div className="name">{tl("Request money")}</div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default UserData;
