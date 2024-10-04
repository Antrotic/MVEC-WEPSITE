import React, { memo } from "react";
import { t } from "i18next";
import InputPhone from "../form/form-item/InputPhone";
import InputText from "../form/form-item/InputText";
import { Card, CardTitle } from "reactstrap";
import PencilFillIcon from "remixicon-react/PencilFillIcon";
import { PickupFromIcon } from "../../public/assets/images/svg";
import useModal from "../../hooks/useModal";
import PercelAddress from "./percel-address";
import { useState } from "react";
import { useEffect } from "react";
import { phoneInputValidator } from "../../utils/parcelFormValidator";

const SenderForm = ({ data, handleData, setData, isFormValidating }) => {
  const { address_from } = data;
  const [open, handleOpen, handleClose] = useModal();
  const [value, setValue] = useState(address_from);
  const [modalAddress, setModalAddress] = useState(null);

  const isInputInvalid = (inputValue) => isFormValidating && !inputValue;

  const handleChange = (e) => {
    setData((prev) => {
      const newAddress = {
        ...prev.address_from,
        [e.target.name]: e.target.value,
      };
      return { ...prev, address_from: newAddress };
    });
  };

  useEffect(() => {
    setValue(address_from.address);
    setModalAddress({
      address: address_from.address,
      location: { lat: address_from.latitude, lng: address_from.longitude },
    });
  }, [open, address_from]);
  return (
    <>
      <Card className="sender-form">
        <CardTitle tag="h4">{t("sender.details")}</CardTitle>
        <button
          type="button"
          className="rowBtn mb-0"
          onClick={() => {
            //   handlePickupAddress();
            handleOpen();
          }}
        >
          <div className="item">
            <PickupFromIcon />
            <div className="naming">
              <div className="label">{t("address")}</div>
              <div className="value">{address_from.address}</div>
            </div>
          </div>
          <div className="icon">
            <PencilFillIcon />
          </div>
        </button>
        <InputPhone
          error={
            isFormValidating && !data?.phone_from ? "Enter valid number" : ""
          }
          onChange={(e) => phoneInputValidator(e, handleData)}
          name="phone_from"
          label="phone"
        />
        <InputText
          label="username"
          placeholder="type.here"
          name="username_from"
          onChange={handleData}
          invalid={isInputInvalid(data?.username_from)}
        />
        <InputText
          label="house"
          placeholder="type.here"
          name="house"
          onChange={handleChange}
          invalid={isInputInvalid(data?.address_from?.house)}
        />
        <InputText
          label="stage"
          placeholder="type.here"
          name="stage"
          onChange={handleChange}
          invalid={isInputInvalid(data?.address_from?.stage)}
        />
        <InputText
          label="room"
          placeholder="type.here"
          name="room"
          onChange={handleChange}
          invalid={isInputInvalid(data?.address_from?.room)}
        />
        <InputText
          label="comment"
          placeholder="type.here"
          name="note"
          onChange={handleData}
          invalid={isInputInvalid(data?.note)}
        />
      </Card>
      <PercelAddress
        value={value}
        modalType="address_from"
        setValue={setValue}
        address={modalAddress}
        setData={setData}
        setAddress={setModalAddress}
        modal={{ open, handleOpen, handleClose }}
      />
    </>
  );
};

export default SenderForm;
