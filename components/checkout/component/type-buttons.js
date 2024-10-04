import React from "react";
import { useTranslation } from "react-i18next";
import RoadsterFillIcon from "remixicon-react/RoadsterFillIcon";
import TruckFillIcon from "remixicon-react/TruckFillIcon";

const TypeButtons = ({
  deliveryTypes,
  setDeliveryTab,
  deliveryTab,
  deliveryPickup,
}) => {
  const { t: tl } = useTranslation();
  return (
    <>
      {deliveryTypes?.length !== 0 && (
        <div className="content">
          <button
            className={`item ${deliveryTab === "delivery" && "active"}`}
            onClick={() => setDeliveryTab("delivery")}
          >
            <div className="icon">
              <RoadsterFillIcon />
            </div>
            <div className="label">{tl("Delivery")}</div>
          </button>
          <button
            className={`item ${deliveryTab === "pickup" && "active"}`}
            onClick={() => setDeliveryTab("pickup")}
            disabled={!deliveryPickup}
          >
            <div className="icon">
              <TruckFillIcon />
            </div>
            <div className="label">{tl("Pickup")}</div>
          </button>
        </div>
      )}
    </>
  );
};

export default TypeButtons;
