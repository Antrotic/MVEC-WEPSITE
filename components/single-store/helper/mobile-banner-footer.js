import React from "react";
import { useTranslation } from "react-i18next";
import Bookmark3LineIcon from "remixicon-react/Bookmark3LineIcon";
import ErrorWarningLineIcon from "remixicon-react/ErrorWarningLineIcon";
import StarFillIcon from "remixicon-react/StarFillIcon";
import TruckLineIcon from "remixicon-react/TruckLineIcon";
import GroupLineIcon from "remixicon-react/GroupLineIcon";
import { shallowEqual, useSelector } from "react-redux";
import dayjs from "dayjs";
import ShopShare from "../../shopShare/shopShare";

const MobileBannerFooter = ({ data, setVisible, saved, savedStore, handleTogether }) => {
  const { t: tl } = useTranslation();
  const { generalData } = useSelector((state) => state.cart, shallowEqual);
  return (
    <div className="banner-footer mobile">
      <div className="footer-top">
        <div className="title">{data.translation?.title}</div>
        <div className="item">
          <StarFillIcon className="icon" color="#FFB800" />
          <div className="label">{data.rating_avg ? data.rating_avg : "0.0"}</div>
          {/* onClick={() => setVisible("rating")} */}
        </div>
      </div>
      <div className="info">
        <div className="item" onClick={() => setVisible("store-info")}>
          <ErrorWarningLineIcon size={20} className="icon" />
          <div className="label">{tl("Store info")}</div>
        </div>
        <span></span>
        <div className="item" onClick={() => setVisible("store-delivery")}>
          <TruckLineIcon size={20} className="icon" />
          <div className="label">{generalData?.delivery_time ? tl("edit.schedule") : tl("schedule")}</div>
          {!!generalData?.delivery_time && (
            <div className="label time">
              {dayjs(generalData.delivery_date).format("ddd, MMM DD,")} {generalData.delivery_time}
            </div>
          )}
        </div>
        <span></span>
        <div className="item">
          <Bookmark3LineIcon className="icon" onClick={saved} size={20} color={savedStore && "green"} />
        </div>
        <div className="item">
          <ShopShare data={data} size={20} />
        </div>
        <div className="item" onClick={handleTogether}>
          <GroupLineIcon className="icon" size={20} />
          <div className="label">{tl("Together order")}</div>
        </div>
      </div>
    </div>
  );
};

export default MobileBannerFooter;
