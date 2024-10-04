import React, { useRef, useState } from "react";
import { Input } from "reactstrap";

export default function InputCheckbox({ name, value, label, onChange }) {
  const { current: inputId } = useRef(Math.random().toString(16) + "checkbox");
  return (
    <div className="form-item-checkbox">
      <label htmlFor={inputId}>
        <Input
          checked={Boolean(value) || null}
          onChange={(e) => {
            onChange?.(e.target.checked);
          }}
          id={inputId}
          name={name}
          type="checkbox"
        />
        <span>{label}</span>
      </label>
    </div>
  );
}
