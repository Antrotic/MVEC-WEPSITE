import React, { useEffect } from "react";
import GoogleMap from "../map";
import { shallowEqual, useSelector } from "react-redux";
import { useState } from "react";
import AddressCard from "./helper/address-card";
import { parseCookies } from "nookies";

const EditAddress = () => {
  const user = useSelector((state) => state.user.data, shallowEqual);
  const userLocation = parseCookies().userLocation;
  const [address, setAddress] = useState("");
  const newUserLocation = userLocation?.split(",");
  const currentLocation = user?.addresses?.find(
    (item) =>
      item.location.latitude === newUserLocation[0] ||
      item.location.longitude === newUserLocation[1]
  );
  useEffect(() => {
    if (currentLocation)
      setAddress({
        location: {
          lat: currentLocation?.location.latitude,
          lng: currentLocation?.location.longitude,
        },
        address: currentLocation?.address,
      });
    else {
      setAddress({
        location: {
          lat: newUserLocation[0],
          lng: newUserLocation[1],
        },
        address: currentLocation?.address,
      });
    }
  }, [currentLocation]);

  return (
    <>
      <AddressCard className="edit-address" />
      <GoogleMap address={address} setAddress={setAddress} />
    </>
  );
};

export default EditAddress;
