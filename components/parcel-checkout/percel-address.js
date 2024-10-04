import React from "react";
import { useDispatch } from "react-redux";
import MyModal from "../modal";
import GoogleMap from "../map";
import { shallowEqual, useSelector } from "react-redux";
import { setVisible } from "../../redux/slices/mainState";
import GetPosition from "../map/get-position";
import { Button, Col, Row } from "reactstrap";
import { getCurrentLocation } from "../../utils/getCurrentLocation";
import CompassDiscoverLineIcon from "remixicon-react/CompassDiscoverLineIcon";
import { t } from "i18next";

const PercelAddress = ({
  value,
  setValue,
  address,
  setAddress,
  modalType, // 'address_from' | 'address_to'
  setData,
  modal,
}) => {
  const { open, handleClose } = modal;

  const onSubmit = () => {
    setData((prev) => {
      const newAddress = {
        ...prev[modalType],
        address: address.address,
        latitude: address.location.lat,
        longitude: address.location.lng,
      };
      return { ...prev, [modalType]: newAddress };
    });
    handleClose();
  };
  return (
    <MyModal
      visible={open}
      handleClose={handleClose}
      className="address-modal"
      centered={true}
      size="lg"
      title="enter.delivery.address"
    >
      <div className="search-address">
        <GetPosition
          setValue={setValue}
          value={value}
          setAddress={setAddress}
        />
        <Button
          onClick={() =>
            getCurrentLocation({
              setAddress,
              //  setValue
            })
          }
        >
          <CompassDiscoverLineIcon />
        </Button>
      </div>
      <GoogleMap
        mapContent="add-address"
        setValue={setValue}
        address={address}
        setAddress={setAddress}
      />
      <Row className="mt-2">
        <Col xs="12">
          <Button className="enter-address" onClick={onSubmit}>
            {t("submit")}
          </Button>
        </Col>
      </Row>
    </MyModal>
  );
};

export default PercelAddress;
