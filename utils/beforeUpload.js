import { toast } from "react-toastify";

export const beforeUpload = (file) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg" ||
    file.type === "image/svg+xml" ||
    file.type === "image/webp";
  if (!isJpgOrPng) {
    toast.error("You can only upload JPG/PNG/SVG/WEBP file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    toast.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
