import { Badge, Modal, ModalBody, ModalHeader } from "reactstrap";
import React, { useState } from "react";
import { t } from "i18next";
import { RefundApi } from "../../api/main/refund";
import { useEffect } from "react";
import { getPrice } from "../../utils/getPrice";
import CartLoader from "../loader/cart-loader";
const RefundDetailModal = ({ modalDetail, setModalDetail }) => {
  const [detail, setDetail] = useState(null);
  const toggle = () => {
    setModalDetail(!modalDetail);
  };
  const getDetail = () => {
    RefundApi.getId(modalDetail)
      .then(({ data }) => {
        setDetail(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (modalDetail) getDetail();
  }, []);

  const GetModalBody = () => {
    if (detail) {
      return (
        <div className="refund-message">
          <p className="refund-message__title">
            #{detail?.order_id} order has been refunded.
          </p>
          <p className="refund-message__amount">
            Refund Amount: {getPrice(detail?.order?.price)}
          </p>
          <p className="refund-message__status">
            <span className="label">{`${t("status")}: `}</span>{" "}
            <Badge>{detail?.status || ""}</Badge>
          </p>
          <p className="refund-message__user">
            <span className="label"> {t("message.user")}</span>
            <span>{detail?.message_user || t("not.answered.yet")}</span>
          </p>
          <p className="refund-message__seller">
            <span className="label">{t("message.seller")}</span>
            <span>{detail?.message_seller || t("not.answered.yet")}</span>
          </p>
        </div>
      );
    } else
      return (
        <div className="refund-message">
          <CartLoader />
        </div>
      );
  };
  return (
    <Modal isOpen={Boolean(modalDetail)} toggle={toggle} centered={true}>
      <ModalHeader toggle={toggle}>{t("Refund status")}</ModalHeader>
      <ModalBody>
        <GetModalBody />
      </ModalBody>
    </Modal>
  );
};

export default RefundDetailModal;
