import React, { useEffect, useState, useContext } from "react";
import { t } from "i18next";
import {
  Button,
  Card,
  CardTitle,
  FormFeedback,
  FormGroup,
  Input,
  Spinner,
} from "reactstrap";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import InputPhone from "../form/form-item/InputPhone";
import InputText from "../form/form-item/InputText";
import PencilFillIcon from "remixicon-react/PencilFillIcon";
import { LocationOutline } from "../../public/assets/images/svg";
import PercelAddress from "./percel-address";
import useModal from "../../hooks/useModal";
import parcelService from "../../services/parcel";
import {
  phoneInputValidator,
  validateFormData,
} from "../../utils/parcelFormValidator";
import { getPrice } from "../../utils/getPrice";
import { MainContext } from "../../context/MainContext";


const ReceiverForm = ({
  handleDeliveryAddress,
  setData,
  data,
  handleData,
  isFormValidating,
  setIsFormValidating,
  parcelPrice,
}) => {
  const { address_to } = data;
  const [open, handleOpen, handleClose] = useModal();
  const [value, setValue] = useState(address_to.address);
  const [modalAddress, setModalAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const cookies = parseCookies();
  const { push } = useRouter();

  const { handleAuth } = useContext(MainContext);

  const isInputInvalid = (inputValue) => isFormValidating && !inputValue;

  const handleChange = (e) => {
    setData((prev) => {
      const newAddress = {
        ...prev.address_to,
        [e.target.name]: e.target.value,
      };
      return { ...prev, address_to: newAddress };
    });
  };

  const handleFormSubmit = () => {
    // Check user has logged in
    if (!cookies.access_token) {
      toast.error("Please login first");
      handleAuth("login");
      return;
    }
    // start validating form fields
    setIsFormValidating(true);
    const isFormValid = validateFormData(data);
    // if validation correct submit tha data
    if (isFormValid) {
      setLoading(true);
      parcelService
        .create(data)
        .finally(() => setLoading(false))
        .then(() => {
          toast.success("Order successfully created!");
          push("/");
        });
    }
  };

  useEffect(() => {
    setValue(address_to.address);
    setModalAddress({
      address: address_to.address,
      location: { lat: address_to.latitude, lng: address_to.longitude },
    });
  }, [open, address_to]);
  return (
    <>
      <Card className="receiver-form">
        <CardTitle tag="h4">{t("receiver.details")}</CardTitle>
        <button
          type="button"
          className="rowBtn mb-0"
          onClick={() => {
            // handleDeliveryAddress();
            handleOpen();
          }}
        >
          <div className="item">
            <LocationOutline />
            <div className="naming">
              <div className="label">{t("address")}</div>
              <div className="value">{address_to.address}</div>
            </div>
          </div>
          <div className="icon">
            <PencilFillIcon />
          </div>
        </button>
        <InputPhone
          error={
            isFormValidating && !data?.phone_to ? "Enter valid number" : ""
          }
          onChange={(e) => phoneInputValidator(e, handleData)}
          name="phone_to"
          label="phone"
        />
        <InputText
          name="username_to"
          onChange={handleData}
          label="username"
          placeholder="type.here"
          invalid={isInputInvalid(data?.username_to)}
        />
        <InputText
          name="house"
          onChange={handleChange}
          label="house"
          placeholder="type.here"
          invalid={isInputInvalid(data?.address_to?.house)}
        />
        <InputText
          name="stage"
          onChange={handleChange}
          label="stage"
          placeholder="type.here"
          invalid={isInputInvalid(data?.address_to?.stage)}
        />
        <InputText
          name="room"
          onChange={handleChange}
          label="room"
          placeholder="type.here"
          invalid={isInputInvalid(data?.address_to?.room)}
        />
        <InputText
          label="instructions"
          name="instructions"
          onChange={handleData}
          placeholder="type.here"
          invalid={isInputInvalid(data?.instructions)}
        />
        <InputText
          name="description"
          onChange={handleData}
          placeholder="what.are.you.sending"
          invalid={isInputInvalid(data?.description)}
        />
        <InputText
          name="qr_value"
          onChange={handleData}
          placeholder="item.value.qr"
          invalid={isInputInvalid(data?.qr_value)}
        />
        <button type="button" className="rowBtn mb-0">
          <div className="item">
            <div className="naming">
              <div className="label">{t("remain.anonymus")}</div>
              <div className="value">{t("dont.notify.a.recipient")}</div>
            </div>
          </div>
          <div className="icon make-gift">
            <FormGroup switch>
              <Input
                onChange={() =>
                  setData((prev) => ({
                    ...prev,
                    notify: prev.notify === 1 ? 0 : 1,
                  }))
                }
                type="switch"
                role="switch"
                checked={data.notify === 0}
              />
            </FormGroup>
          </div>
        </button>
        <Button
          disabled={!parcelPrice.price || loading}
          onClick={handleFormSubmit}
          className="enter-address mt-4"
        >
          {loading ? (
            <Spinner color="secondary" size="sm" />
          ) : (
            `${t("pay")} ${
              parcelPrice.price > 0 ? getPrice(parcelPrice.price) : ""
            }`
          )}
        </Button>
      </Card>
      <PercelAddress
        value={value}
        modalType="address_to"
        setValue={setValue}
        address={modalAddress}
        setData={setData}
        setAddress={setModalAddress}
        modal={{ open, handleOpen, handleClose }}
      />
    </>
  );
};

export default ReceiverForm;
