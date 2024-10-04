import React, { useState } from "react";
import { FormFeedback, FormGroup, FormText, Input } from "reactstrap";

const InputPassword = ({
  label,
  placeholder = "******",
  name,
  required,
  value,
  onChange = () => {},
  onBlur = () => {},
}) => {
  const [isValid, setIsValid] = useState(false);

  const validatePassword = (value) => {
    // Password criteria
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setIsValid(validatePassword(value));
    onChange(e);
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
          valid={isValid && value}
          invalid={!isValid && value}
          value={value}
          onChange={(e) => {
            handlePasswordChange(e);
          }}
          required={required}
          minLength={5}
          onBlur={onBlur}
        />
        <FormFeedback>
          Password must contain at least 8 characters including 1 uppercase
          letter, 1 lowercase letter, 1 digit, and 1 special character.
        </FormFeedback>
      </FormGroup>
    </div>
  );
};

export default InputPassword;
