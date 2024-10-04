import React from "react";
import { ArrowDown, LocationOutline } from "../../../public/assets/images/svg";
import { t } from "i18next";

const SelectAddress = ({ label, icon = <LocationOutline />, onClick = () => {}, value, name }) => {
  return (
    <div className="form-item" onClick={() => onClick({ target: { name, value } })}>
      <div className="label">{label}</div>
      <div className="address-form-item">
        <div className="suffix location">{icon}</div>
        <span>{value || t("default.address")}</span>
        <div className="suffix arrow">
          <ArrowDown />
        </div>
      </div>
    </div>
  );
};

export default SelectAddress;
