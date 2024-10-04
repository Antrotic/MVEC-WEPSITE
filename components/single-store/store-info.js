import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import MapPin2FillIcon from "remixicon-react/MapPin2FillIcon";
import FileList2LineIcon from "remixicon-react/FileList2LineIcon";
import TimeFillIcon from "remixicon-react/TimeFillIcon";
import PhoneFillIcon from "remixicon-react/PhoneFillIcon";
import StarFillIcon from "remixicon-react/StarFillIcon";
import RoadMapFillIcon from "remixicon-react/RoadMapFillIcon";
import { useTranslation } from "react-i18next";
import GetWorkingHours from "../time-range/get-working-hours";
import MapOnlyShow from "../map/only-show";

function StoreInfo({ setOpenContent }) {
  const { t: tl } = useTranslation();
  const shop = useSelector((state) => state.stores.currentStore, shallowEqual);

  useEffect(() => {
    return () => setOpenContent("store-delivery");
  }, []);
  return (
    <div className="store-info">
      {Boolean(shop?.location) && (
        <MapOnlyShow mapData={{ location: shop?.location }} />
      )}
      <div className="info-item">
        <div className="icon">
          <MapPin2FillIcon size={20} />
        </div>
        <div className="text">
          <div className="title">{shop?.translation?.title}</div>
          <div className="description">{shop?.translation?.address}</div>
        </div>
      </div>
      <div className="info-item">
        <div className="icon">
          <PhoneFillIcon size={20} />
        </div>
        <div className="text">
          <div className="title">
            <a href={`tel:${shop?.phone}`}>{shop?.phone}</a>
          </div>
          <div className="description">{tl("phone")}</div>
        </div>
      </div>
      <div className="info-item">
        <div className="icon">
          <TimeFillIcon size={20} />
        </div>
        <div className="text">
          <div className="title">
            <GetWorkingHours shop={shop} />
          </div>
          <div className="description">{tl("Today working hours")}</div>
        </div>
      </div>
      <div className="info-item">
        <div className="icon">
          <RoadMapFillIcon size={20} />
        </div>
        <div className="text">
          <div className="title">
            {shop?.delivery_time
              ? tl(`delivery.range.${shop?.delivery_time?.type}`, {
                  times: `${shop?.delivery_time?.from}-${shop?.delivery_time?.to}`,
                })
              : tl("not attached yet")}
          </div>
          <div className="description">{tl("Delivery time")}</div>
        </div>
      </div>
      <div className="info-item">
        <div className="icon">
          <StarFillIcon size={20} />
        </div>
        <div className="text">
          <div className="title">{shop?.rating_avg || 0}</div>
          <div className="description">{tl("Rating avarage")}</div>
        </div>
      </div>
      <div className="info-item">
        <div className="icon">
          <FileList2LineIcon size={20} />
        </div>
        <div className="text">
          <div className="title">{tl("description")}</div>
          <div className="description">{shop?.translation?.description}</div>
        </div>
      </div>
    </div>
  );
}

export default StoreInfo;
