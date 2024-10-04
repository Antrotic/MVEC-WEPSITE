import { useState } from "react";

export default function useModal(isOpen = false) {
  const [open, setOpen] = useState(isOpen);

  const handleOpen = (event) => {
    event?.preventDefault();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return [open, handleOpen, handleClose];
}
