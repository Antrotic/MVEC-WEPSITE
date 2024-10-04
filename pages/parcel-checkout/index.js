import React, { useState } from "react";
import nookies from "nookies";
import Footer from "../../components/footer";
import ParcelMap from "../../components/parcel-checkout/parcel-map";
import { Col, Row } from "reactstrap";
import SenderForm from "../../components/parcel-checkout/sender-form";
import ReceiverForm from "../../components/parcel-checkout/receiver-form";
import { useSelector } from "react-redux";
import Unauthorized from "../../components/unauthorized/unauthorized";

const ParcelCheckout = () => {
  const cookies = nookies.get();
  const currency_id = cookies.currency_id;
  const [isFormValidating, setIsFormValidating] = useState(false);
  const [parcelPrice, setParcelPrice] = useState({ km: 0, price: 0 });

  const user = useSelector((state) => state.user.data);
  const isLoggedIn = !!Object.keys(user).length;

  const [data, setData] = useState({
    address_from: {
      address: "Tashkent, Uzbekistan",
      house: undefined,
      latitude: 41.2994958,
      longitude: 69.2400734,
      room: undefined,
      stage: undefined,
    },
    address_to: {
      address: "Samarkand, Uzbekistan",
      house: undefined,
      latitude: 39.6507963,
      longitude: 66.9653502,
      room: undefined,
      stage: undefined,
    },
    delivery_date: "2023-08-15",
    delivery_time: "13:00",
    description: undefined,
    images: [],
    instructions: undefined,
    note: "",
    notify: 0,
    phone_from: "",
    phone_to: "",
    qr_value: undefined,
    // rate: 1,
    username_from: "",
    username_to: "",
    payment_type_id: undefined,
    type_id: "",
    currency_id,
  });

  const handleData = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="parcel-box">
      <div className="container">
        {isLoggedIn ? (
          <>
            <ParcelMap
              isFormValidating={isFormValidating}
              setData={setData}
              data={data}
              handleData={handleData}
              parcelPrice={parcelPrice}
              setParcelPrice={setParcelPrice}
            />
            <Row>
              <Col>
                <SenderForm
                  // handlePickupAddress={handlePickupAddress}
                  setData={setData}
                  data={data}
                  handleData={handleData}
                  isFormValidating={isFormValidating}
                />
              </Col>
              <Col>
                <ReceiverForm
                  // handleDeliveryAddress={handleDeliveryAddress}
                  setData={setData}
                  data={data}
                  handleData={handleData}
                  isFormValidating={isFormValidating}
                  setIsFormValidating={setIsFormValidating}
                  parcelPrice={parcelPrice}
                />
              </Col>
            </Row>
          </>
        ) : (
          <Unauthorized
            image="/assets/images/empty-cart.png"
            text="sign.in.to.use.parcel.order"
          />
        )}
        <Footer />
      </div>
    </div>
  );
};

export default ParcelCheckout;
