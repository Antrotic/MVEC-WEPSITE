import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Col, Row, Spinner } from "reactstrap";
import { AddressApi } from "../../api/main/address";
import { MainContext } from "../../context/MainContext";
import {
  setEditAddress,
  setMapContent,
  setOpenModal,
} from "../../redux/slices/mainState";
import InputText from "../form/form-item/InputText";
import GoogleMap from "../map";
import GetPosition from "../map/get-position";
import CompassDiscoverLineIcon from "remixicon-react/CompassDiscoverLineIcon";
import { getCurrentLocation } from "../../utils/getCurrentLocation";
import { checkZone, handleLoading } from "../../redux/slices/check-zone";
import { parseCookies } from "nookies";
const FormAddress = () => {
  const dispatch = useDispatch();
  const { editAddress } = useSelector((state) => state.mainState, shallowEqual);
  const openModal = useSelector(
    (state) => state.mainState.openModal,
    shallowEqual
  );
  const { loading, error } = useSelector(
    (state) => state.checkZone,
    shallowEqual
  );
  const [title, setTitle] = useState(null);
  const [value, setValue] = useState(null);
  const [address, setAddress] = useState(null);
  const { getUser } = useContext(MainContext);

  useEffect(() => {
    if (!openModal) {
      setTitle("");
      batch(() => {
        dispatch(setEditAddress(null));
        dispatch(setMapContent(""));
      });
    }
  }, [openModal]);

  useEffect(() => {
    const address = parseCookies()?.userLocation.split(",") || [];
    setTitle(editAddress?.title);
    setValue(editAddress?.address);
    setAddress({
      address: editAddress?.address || "",
      location: {
        lat: editAddress?.location?.latitude || address[0],
        lng: editAddress?.location?.longitude || address[1],
      },
    });
  }, [editAddress]);

  const findMe = ({ lat, lng }) => {
    dispatch(checkZone({ lat, lng }));
  };

  return (
    <>
      <div className="search-address">
        <GetPosition setAddress={setAddress} />
        <Button onClick={() => getCurrentLocation({ setAddress, findMe })}>
          <CompassDiscoverLineIcon />
        </Button>
      </div>
      <GoogleMap address={address} setAddress={setAddress} />
      <Row className="mt-2">
        <Col xs="12">
          <Button className="enter-address">tl("submit")</Button>
        </Col>
      </Row>
    </>
  );
};

export default FormAddress;
