import { t } from "i18next";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const InputPhone = ({
  label = "Phone",
  placeholder,
  name,
  required,
  value,
  onChange = () => {},
  disabled = false,
  error,
}) => {
  return (
    <React.Fragment>
      <div className="form-item">
        <div className="label">
          {`${t(label)} `} {required && <span>*</span>}
        </div>
        <PhoneInput
          inputProps={{
            name,
            required,
            disabled,
            placeholder,
            autoFocus: false,
          }}
          value={value}
          country={"us"}
          onChange={(phone, _, e) => onChange(e)}
        />
      </div>
      <span
        className="invalid-feedback"
        style={{ display: Boolean(error) ? "block" : "" }}
      >
        {error}
      </span>
    </React.Fragment>
  );
};
export default InputPhone;
