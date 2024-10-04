import React, { useContext, useEffect, useState } from "react";
import MapPinRangeFillIcon from "remixicon-react/MapPinRangeFillIcon";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import CheckDoubleLineIcon from "remixicon-react/CheckDoubleLineIcon";
import AddLineIcon from "remixicon-react/AddLineIcon";
import { AuthContext } from "../../../context/AuthContext";
import OutsideAlerter from "../../../hooks/useClickOutside";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setOpenModal } from "../../../redux/slices/mainState";
import { getAddress } from "../../../utils/getAddress";
import checkShopLocationService from "../../../services/check-shop-location";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";

const SelectAddress = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t: tl } = useTranslation();
  const userLocation = parseCookies()?.userLocation;
  const [visible, setVisible] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const { setUserDefaultLocation } = useContext(AuthContext);

  const user = useSelector((state) => state.user.data);
  const shop = useSelector((state) => state.stores.currentStore);
  const newUserLocation = userLocation?.split(",");
  const address = user.addresses;

  const cuurentAddress = address?.find(
    (item) =>
      item.location.latitude === newUserLocation[0] ||
      item.location.longitude === newUserLocation[1]
  );

  const handleVisible = () => {
    setVisible(true);
  };

  const handleAddress = (e, item) => {
    e.stopPropagation();
    setUserDefaultLocation({ ...item.location, address: item.address });
    const { latitude, longitude } = item.location;
    checkShopLocationService
      .check({
        id: shop?.id,
        "address[latitude]": latitude,
        "address[longitude]": longitude,
      })
      .then(({ data }) => {
        return;
      })
      .catch((error) => {
        console.error(error);
        router.push("/");
      });
  };

  useEffect(() => {
    getAddress({ setDefaultAddress, userLocation, user });
  }, [userLocation]);

  return (
    <div
      onClick={handleVisible}
      className={visible ? "select-address active" : "select-address"}
    >
      <MapPinRangeFillIcon size={20} />
      <div className="label">
        {cuurentAddress ? cuurentAddress.address : defaultAddress?.address}
      </div>
      <ArrowDownSLineIcon size={20} className="arrow-down" />
      <OutsideAlerter visible={visible} setVisible={setVisible}>
        <div className="enter-address">
          <div
            className="add-address-btn"
            onClick={() => dispatch(setOpenModal(true))}
          >
            <AddLineIcon />
            <span>{tl("Add new address")}</span>
          </div>
          {address?.map((item, key) => {
            const lat_lng = `${item.location.latitude},${item.location.longitude}`;
            return (
              <div
                key={key}
                className="address-list"
                onClick={(e) => handleAddress(e, item)}
              >
                <span>{item.address}</span>
                {lat_lng === userLocation && (
                  <CheckDoubleLineIcon className="suffix" />
                )}
              </div>
            );
          })}
        </div>
      </OutsideAlerter>
    </div>
  );
};

export default SelectAddress;
