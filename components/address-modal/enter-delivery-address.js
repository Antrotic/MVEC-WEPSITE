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
const EnterDeliveryAddress = () => {
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
  const { t: tl } = useTranslation();
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

  const addAddress = () => {
    if (!title) {
      toast.error(tl("Please enter address title"));
    } else {
      dispatch(handleLoading(true));
      AddressApi.create({
        title: `${title}`,
        address: address?.address,
        location: `${address?.location?.lat},${address?.location?.lng}`,
        active: 0,
      })
        .then(() => {
          dispatch(setOpenModal(false));
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response?.data?.message);
        })
        .finally(() => {
          getUser();
          setTitle("");
          dispatch(handleLoading(false));
        });
    }
  };
  const updateAddress = () => {
    if (!title) {
      toast.error(tl("Please enter address title"));
    } else {
      dispatch(handleLoading(true));
      AddressApi.update(editAddress?.id, {
        title: `${title}`,
        address: value,
        location: `${editAddress.location.latitude},${editAddress.location.longitude}`,
        active: 0,
      })
        .then(() => {
          batch(() => {
            dispatch(setOpenModal(false));
            dispatch(setMapContent(""));
          });
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response?.data?.message);
        })
        .finally(() => {
          getUser();
          setTitle("");
          setValue("");
          dispatch(handleLoading(false));
        });
    }
  };
  const handleAddressEvent = () => {
    if (editAddress) updateAddress();
    else addAddress();
  };
  const findMe = ({ lat, lng }) => {
    dispatch(checkZone({ lat, lng }));
  };

  return (
    <>
      <div className="search-address">
        <GetPosition
          setValue={setValue}
          value={value}
          setAddress={setAddress}
        />
        <Button
          onClick={() => getCurrentLocation({ setAddress, setValue, findMe })}
        >
          <CompassDiscoverLineIcon />
        </Button>
      </div>
      <GoogleMap
        address={address}
        setAddress={setAddress}
        setValue={setValue}
      />
      <Row className="mt-2">
        <Col xs="12">
          <InputText
            label="Title"
            placeholder="enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Col>
        <Col xs="12">
          <Button
            disabled={Boolean(error)}
            onClick={handleAddressEvent}
            className="enter-address"
          >
            {loading ? (
              <Spinner size="sm" />
            ) : Boolean(error) ? (
              tl("delivery.zone.not.available")
            ) : (
              tl("submit")
            )}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default EnterDeliveryAddress;
