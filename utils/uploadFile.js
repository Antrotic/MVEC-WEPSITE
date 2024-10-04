import { toast } from "react-toastify";
import { UploadApi } from "../api/main/upload";
import { t } from "i18next";
import { beforeUpload } from "./beforeUpload";

export const fileSelectedHandler = ({
  event,
  type = "",
  file = [],
  gallery = [],
  uploadImages = [],
  setFile = () => {},
  setGallery = () => {},
  setUploadImages = () => {},
  setAvatar = () => {},
  limit = Infinity, // Default value is set to Infinity
}) => {
  const { type: fileType } = event.target.files[0] || {};
  const isJpgOrPng =
    fileType === "image/jpeg" ||
    fileType === "image/png" ||
    fileType === "image/jpg" ||
    fileType === "image/svg+xml" ||
    fileType === "image/webp";

  if (isJpgOrPng) {
    if (gallery.length >= limit) {
      toast.error(`You can only select up to ${limit} files.`);
      return;
    }
    if (beforeUpload(event.target.files[0])) {
      setFile([...file, event.target.files[0]]);
      const images = new FormData();
      images.append("image", event.target.files[0]);
      images.append("type", type);
      UploadApi.create(images)
        .then((res) => {
          setUploadImages([...uploadImages, res.data.title]);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error");
        });
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
          setGallery([...gallery, reader.result]);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  } else {
    toast.error(t("You need to select jpeg, png or svg file"));
  }
};
