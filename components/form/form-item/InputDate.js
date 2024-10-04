import React from "react";
import { Input } from "reactstrap";
import monent from "moment";

const InputDate = ({
  label,
  placeholder,
  name,
  required,
  invalid = false,
  valid = false,
  value,
  onChange = () => {},
  type = "date",
  minDate,
  maxDate,
}) => {
  return (
    <div className="form-item w-100 mx-a">
      <div className="label">{label}</div>
      <Input
        min={minDate}
        max={maxDate}
        type={type}
        name={name}
        placeholder={placeholder}
        valid={valid}
        invalid={invalid}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
        required={required}
      />
    </div>
  );
};

export default InputDate;
