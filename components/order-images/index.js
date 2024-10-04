import React, { useState } from "react";
import EyeLineIcon from "remixicon-react/EyeLineIcon";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import useModal from "../../hooks/useModal";
import MyModal from "../modal";
import { getImage } from "../../utils/getImage";
import { UploadApi } from "../../api/main/upload";
import { Spinner } from "reactstrap";
import { toast } from "react-toastify";
import { beforeUpload } from "../../utils/beforeUpload";

export default function OrderImages({ orderImages, setOrderImages }) {
  const [previewImage, serPreviewImage] = useState("");
  const [open, handleOpen, handleClose] = useModal();
  const handlePreviewImage = (imageSrc) => {
    serPreviewImage(imageSrc);
    handleOpen();
  };

  const handleDeleteImage = (imageIndex) => {
    setOrderImages(orderImages.filter((_, idx) => idx !== imageIndex));
  };
  return (
    <div className='order-images__container'>
      <h3 className='order-images__label'>Order images</h3>

      <div className='order-images__wrapper'>
        {orderImages.map((imageData, idx) => (
          <div
            key={imageData.id}
            className='order-images__box-item order-images__box-item--img-box'
          >
            {imageData.uploaded ? (
              <>
                <img className='order-images__image' src={imageData.imgSrc} />
                <div className='order-images__box-item-overlay'>
                  <button
                    onClick={() => {
                      handlePreviewImage(imageData.imgSrc);
                    }}
                  >
                    <EyeLineIcon />
                  </button>
                  <button onClick={() => handleDeleteImage(idx)}>
                    <DeleteBinLineIcon />
                  </button>
                </div>
              </>
            ) : (
              <div className='order-images__image-loader'>
                <Spinner color='primary' size='md'>
                  Loading...
                </Spinner>
              </div>
            )}
          </div>
        ))}
        <label className='order-images__box-item order-images__input'>
          + upload
          <input
            multiple={false}
            accept='image/*'
            style={{ display: "none" }}
            type='file'
            onClick={(e) => {
              e.currentTarget.value = null;
            }}
            onChange={(e) => {
              if (!e.target.files[0] || !beforeUpload(e.target.files[0]))
                return;
              const currentIndex = orderImages.length;
              setOrderImages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  imgSrc: null,
                  uploaded: false,
                },
              ]);
              const images = new FormData();
              images.append("image", e.target.files[0]);
              images.append("type", "orders");
              UploadApi.create(images)
                .then((res) =>
                  setOrderImages((prev) => {
                    prev[currentIndex] = {
                      id: prev[currentIndex].id,
                      imgSrc: res.data.title,
                      uploaded: true,
                    };
                    return [...prev];
                  })
                )
                .catch((err) => {
                  handleDeleteImage(currentIndex);
                  toast.error("Something went wrong");
                  console.error(err);
                });
            }}
          />
        </label>
        <MyModal
          visible={open}
          handleClose={handleClose}
          className='address-modal'
          centered={true}
          size='lg'
          title='Image preview'
        >
          <div className='order-images__image-preview'>
            {getImage(previewImage)}
          </div>
        </MyModal>
      </div>
    </div>
  );
}
