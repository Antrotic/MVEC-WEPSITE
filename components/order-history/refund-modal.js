import { Button, Modal, ModalHeader } from "reactstrap";
import React, { useState } from "react";
import InputText from "../form/form-item/InputText";
import DeleteBin5LineIcon from "remixicon-react/DeleteBin5LineIcon";
import { fileSelectedHandler } from "../../utils/uploadFile";
import AddLineIcon from "remixicon-react/AddLineIcon";
import { RefundApi } from "../../api/main/refund";
import { t } from "i18next";
const RefundModal = ({ modal, setModal, currentOrderId, getOrderHistory }) => {
     const [gallery, setGallery] = useState([]);
     const [message_user, setComment] = useState("");
     const [uploadImages, setUploadImages] = useState([]);

     const handleClear = () => {
          setComment("");
          setGallery([]);
          setUploadImages([]);
     };
     const handleDelete = (key) => {
          gallery.splice(key, 1);
          uploadImages.splice(key, 1);
          setGallery([...gallery]);
          setUploadImages([...uploadImages]);
     };

     const toggle = () => {
          setModal(!modal);
          handleClear();
     };

     function onSubmit(e) {
          e.preventDefault();
          RefundApi.create({
               message_user,
               images: uploadImages,
               order_id: currentOrderId,
          })
               .then((res) => {
                    setModal(false);
                    handleClear();
                    getOrderHistory();
               })
               .catch((error) => {
                    console.log(error);
               });
     }

     return (
          <Modal isOpen={modal} toggle={toggle} centered={true}>
               <ModalHeader toggle={toggle}>{t("Refund")}</ModalHeader>
               <form onSubmit={onSubmit}>
                    <div className="upload-form">
                         <div className="upload-img">
                              {gallery?.map((src, key) => (
                                   <div key={key} className="upload-item">
                                        <img src={src} alt="product" />
                                        <div className="remove" onClick={() => handleDelete(key)}>
                                             <DeleteBin5LineIcon size={26} color="#fff" />
                                        </div>
                                   </div>
                              ))}
                              <label>
                                   <input
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(event) =>
                                             fileSelectedHandler({
                                                  event,
                                                  gallery,
                                                  uploadImages,
                                                  setGallery,
                                                  setUploadImages,
                                                  type: "refund",
                                             })
                                        }
                                        name="image"
                                        required
                                        accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/svg"
                                   />
                                   <div className="upload-select">
                                        <AddLineIcon size={26} color="#ccc" />
                                   </div>
                              </label>
                         </div>
                         <InputText required={true} label="Caption" onChange={(e) => setComment(e.target.value)} />
                         <div className="footer-btns">
                              <Button onClick={toggle} outline>
                                   {t("Cancel")}
                              </Button>
                              <Button type="submit" outline>
                                   {t("Send")}
                              </Button>
                         </div>
                    </div>
               </form>
          </Modal>
     );
};

export default RefundModal;
