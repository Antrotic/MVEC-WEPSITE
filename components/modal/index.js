import React from "react";
import { batch, useDispatch } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { setVisibleAuth } from "../../redux/slices/mainState";
import { t } from "i18next";
function MyModal({
  handleClose,
  setVisible = () => {},
  visible,
  children,
  className,
  footer = false,
  title = "Modal Title",
  centered,
  size = "",
}) {
  const dispatch = useDispatch();
  const onClose = () => {
    setVisible(false);
    handleClose && handleClose();
    batch(() => {
      dispatch(setVisibleAuth(false));
      !handleClose && dispatch(setVisible(false));
    });
  };

  return (
    <Modal
      className={`custom-modal ${className}`}
      toggle={onClose}
      isOpen={visible}
      centered={centered}
      size={size}
    >
      <ModalHeader toggle={onClose}>{t(title)}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      {footer && (
        <ModalFooter>
          <Button color="primary" onClick={onClose}>
            Do Something
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      )}
    </Modal>
  );
}

export default MyModal;
