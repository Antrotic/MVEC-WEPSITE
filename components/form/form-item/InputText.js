import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "reactstrap";

const InputText = ({
  label,
  placeholder,
  name,
  required,
  invalid = false,
  valid = false,
  value,
  onChange = () => {},
  onBlur = () => {},
  disabled = false,
}) => {
  const { t: tl } = useTranslation();

  return (
    <div className="form-item">
      <div className="label">
        {`${tl(label)} `} {required && <span>*</span>}
      </div>
      <Input
        type="text"
        name={name}
        placeholder={placeholder}
        valid={valid}
        invalid={invalid}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default InputText;
