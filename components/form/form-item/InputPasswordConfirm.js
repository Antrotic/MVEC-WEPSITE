import React, { useState } from "react";
import { FormFeedback, FormGroup, FormText, Input } from "reactstrap";

const InputPasswordConfirm = ({
  label,
  placeholder = "******",
  name,
  required,
  value,
  onChange = () => {},
  password,
}) => {
  const [passwordMatch, setPasswordMatch] = useState(false);

  const handlePasswordChange = (e) => {
    onChange(e);
    setPasswordMatch(e.target.value === password);
  };

  return (
    <div className="form-item">
      <div className="label">
        {label} {required && <span>*</span>}
      </div>

      <FormGroup>
        <Input
          type="password"
          name={name}
          placeholder={placeholder}
          valid={passwordMatch && value}
          invalid={!passwordMatch && value}
          value={value}
          onChange={(e) => {
            handlePasswordChange(e);
          }}
          required={required}
        />
        <FormFeedback>
          {passwordMatch ? "Passwords match!" : "Passwords do not match!"}
        </FormFeedback>
      </FormGroup>
    </div>
  );
};

export default InputPasswordConfirm;
