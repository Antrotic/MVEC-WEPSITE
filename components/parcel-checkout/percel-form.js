import React, { useEffect } from "react";
import AddressSelect from "../form/form-item/AddressSelect";
import CustomSelect from "../form/form-item/customSelect";
import InputDate from "../form/form-item/InputDate";
import { PickupFromIcon } from "../../public/assets/images/svg";
import PercelAddress from "./percel-address";
import { setVisible } from "../../redux/slices/mainState";
import { useDispatch } from "react-redux";
import { useState } from "react";
import moment from "moment";
import parcelService from "../../services/parcel";
import { PaymentApi } from "../../api/main/payment";
import useModal from "../../hooks/useModal";
import { getPrice } from "../../utils/getPrice";

const PercelForm = ({ data, setData, handleData, isFormValidating, parcelPrice }) => {
  const [value, setValue] = useState("");
  const [modalAddress, setModalAddress] = useState(null);
  const [types, setTypes] = useState(null);
  const [payments, setPayments] = useState(null);
  const [modalType, setModalType] = useState("address_from"); // address_from | address_to

  const [open, handleOpen, handleClose] = useModal();

  const { type_id, delivery_date, delivery_time, payment_type_id, location_from, location_to } = data || {};

  const { address_from, address_to } = data;

  const handlePickupAddress = (address) => {
    setModalType("address_from");
    handleOpen();
  };

  const handleDeliveryAddress = (address) => {
    setModalType("address_to");
    handleOpen();
  };

  useEffect(() => {
    if (modalType === "address_from") {
      setValue(address_from.address);
      setModalAddress({
        address: address_from.address,
        location: { lat: address_from.latitude, lng: address_from.longitude },
      });
    } else {
      setValue(address_to.address);
      setModalAddress({
        address: address_to.address,
        location: { lat: address_to.latitude, lng: address_to.longitude },
      });
    }
  }, [modalType, address_from, address_to]);
  const handleDeliveryDate = (date) => {
    const delivery_date = moment(date).format("YYYY-MM-DD");
    const delivery_time = moment(date).format("HH:mm");
    setData((prevData) => ({ ...prevData, delivery_date, delivery_time }));
  };

  const getParcelTypes = () => {
    parcelService
      .getAllTypes()
      .then((types) => {
        const optionArray = types.data.data?.map((item) => ({
          label: item.type,
          value: item.id,
          data: item,
        }));
        setTypes(optionArray);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPayments = () => {
    PaymentApi.get()
      .then((payment) => {
        const optionArray = payment.data?.map((item) => ({
          value: item.id,
          label: item.payment?.translation?.title,
        }));
        setPayments(optionArray);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getParcelTypes();
    getPayments();
  }, []);

  const onSuffixClick = ({ e, item }) => {
    e.stopPropagation();
  };

  return (
    <div className="percel-form">
      <form>
        <AddressSelect
          label="pickup.from"
          icon={<PickupFromIcon />}
          onClick={(address) => handlePickupAddress(address)}
          value={address_from.address}
          // address={pickupAddress}
          name="address_from"
        />
        <AddressSelect
          label="delivery.to"
          onClick={(address) => handleDeliveryAddress(address)}
          value={address_to.address}
          // address={deliveryAddress}
          name="address_to"
        />
        <CustomSelect
          options={types}
          label="Type"
          placeholder="Parcel type"
          name="type_id"
          value={type_id}
          question
          invalid={isFormValidating && !data?.type_id}
          onChange={(item) => handleData({ target: { name: "type_id", value: item.value } })}
          onSuffixClick={onSuffixClick}
        />
        <InputDate
          type="datetime-local"
          label="Delivery Date"
          onChange={(e) => handleDeliveryDate(e.target.value)}
          value={`${delivery_date}T${delivery_time}`}
        />
        <CustomSelect
          options={payments}
          label="Payment type"
          placeholder="Payment type"
          name="payment_type_id"
          value={payment_type_id}
          invalid={isFormValidating && !data?.payment_type_id}
          onChange={(item) => handleData({ target: { name: "payment_type_id", value: item.value } })}
        />
      </form>
      {parcelPrice.price !== 0 && (
        <div className="text-center text-success h6">
          {getPrice(parcelPrice.price)} | {parcelPrice.km}km
        </div>
      )}
      <PercelAddress
        value={value}
        modalType={modalType}
        setValue={setValue}
        address={modalAddress}
        setData={setData}
        setAddress={setModalAddress}
        modal={{ open, handleOpen, handleClose }}
      />
    </div>
  );
};

export default PercelForm;
