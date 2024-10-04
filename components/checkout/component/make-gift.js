import React from "react";
import { FormGroup, Input } from "reactstrap";
import GiftFillIcon from "remixicon-react/GiftFillIcon";
import InputText from "../../form/form-item/InputText";
import { useState } from "react";
import { useEffect } from "react";

const MakeGift = ({ setGiftData, giftData }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setGiftData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!checked) {
      setGiftData({});
    }
  }, [checked]);

  return (
    <>
      <div className="make-gift">
        <div className="label">
          <GiftFillIcon />
          <span>Make this order a gift</span>
        </div>
        <FormGroup switch checked={!checked}>
          <Input
            type="switch"
            role="switch"
            onClick={() => setChecked((prev) => !prev)}
          />
        </FormGroup>
      </div>
      {checked && (
        <>
          <InputText
            value={giftData?.name}
            name="name"
            placeholder="name"
            label="Name"
            onChange={(e) => handleChange(e)}
          />
          <InputText
            value={giftData?.phone}
            name="phone"
            placeholder="phone"
            label="Phone"
            onChange={(e) => handleChange(e)}
          />
        </>
      )}
    </>
  );
};

export default MakeGift;
