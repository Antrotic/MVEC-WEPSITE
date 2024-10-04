import { Button, Modal, ModalHeader } from "reactstrap";
import React, { useState } from "react";
import InputText from "../form/form-item/InputText";
import DeleteBin5LineIcon from "remixicon-react/DeleteBin5LineIcon";
import { fileSelectedHandler } from "../../utils/uploadFile";
import AddLineIcon from "remixicon-react/AddLineIcon";
import { t } from "i18next";
import { OrderApi } from "../../api/main/order";
import Rating from "react-rating";
import StarSmileFillIcon from "remixicon-react/StarSmileFillIcon";
import { toast } from "react-toastify";

const ReviewModal = ({
  review: modal,
  setReview: setModal,
  currentOrderId,
}) => {
  const [gallery, setGallery] = useState([]);
  const [comment, setComment] = useState("");
  const [uploadImages, setUploadImages] = useState([]);
  const [rating, setRating] = useState(0);

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
    if (!uploadImages?.length) {
      toast.error("please select image!");
      return;
    }
    OrderApi.createReview({
      comment,
      images: uploadImages,
      order_id: currentOrderId,
      rating,
    })
      .then((res) => {
        console.log(res);
        setModal(false);
        handleClear();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Modal isOpen={modal} toggle={toggle} centered={true}>
      <ModalHeader toggle={toggle}>{t("Review")}</ModalHeader>
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
                    type: "reviews",
                    limit: 3,
                  })
                }
                name="image"
                accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/svg"
              />
              <div className="upload-select">
                <AddLineIcon size={26} color="#ccc" />
              </div>
            </label>
          </div>
          <Rating
            className="rating-review"
            initialRating={rating}
            emptySymbol={<StarSmileFillIcon color="#ccc" />}
            fullSymbol={<StarSmileFillIcon color="gold" />}
            onClick={(value) => setRating(value)}
          />
          <InputText
            required={true}
            label="Caption"
            onChange={(e) => setComment(e.target.value)}
          />
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

export default ReviewModal;
