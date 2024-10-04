import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Button, Modal, ModalBody } from "reactstrap";
import { images } from "../../constants/images";
import subcriptionService from "../../services/subscription";
import { getStaticImage } from "../../utils/getImage";
import { setCookies } from "../../utils/setCookies";
import InputEmail from "../form/form-item/InputEmail";
const Subscribe = () => {
  const { data } = useSelector((state) => state.user, shallowEqual);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const showModal = () => {
    if (!data?.subscription) {
      setIsModalOpen(true);
    }
  };
  const onClose = () => {
    setIsModalOpen(false);
    setCookies({ name: "subscribtion", value: "close" });
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      showModal();
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    subcriptionService
      .create({ email })
      .then((res) => {
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      className="subscribe"
      toggle={onClose}
      isOpen={isModalOpen}
      centered={true}
    >
      <ModalBody>
        <div className="subscribe-form">
          <div className="form-image">{getStaticImage(images.Subscribe)} </div>
          <div className="form-title">Subscribtion</div>
          <div className="form-description">
            Browse to find the images that fit your needs and click to download.
          </div>
          <form onSubmit={(e) => onSubmit(e)}>
            <InputEmail
              required={true}
              label="Email"
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">Submit</Button>
            <span onClick={onClose}>Not now</span>
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Subscribe;
