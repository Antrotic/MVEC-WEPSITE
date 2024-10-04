import React from "react";
import dynamic from "next/dynamic";
import { shallowEqual, useSelector } from "react-redux";
import { setOpenModal } from "../../redux/slices/mainState";
const Modal = dynamic(() => import("../modal"));
const SavedAddress = dynamic(() => import("./edit-address"));
const EnterDeliveryAddress = dynamic(() => import("./enter-delivery-address"));

function Address() {
  const mapContent = useSelector(
    (state) => state.mainState.mapContent,
    shallowEqual
  );
  const openModal = useSelector(
    (state) => state.mainState.openModal,
    shallowEqual
  );
  return (
    <div className="address">
      <Modal
        setVisible={setOpenModal}
        visible={openModal}
        title="Enter delivery address"
        className="address-modal"
        centered={true}
        size="lg"
      >
        {mapContent === "" && <SavedAddress />}
        {mapContent === "add-address" && <EnterDeliveryAddress />}
      </Modal>
    </div>
  );
}

export default Address;
