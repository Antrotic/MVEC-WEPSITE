import React from "react";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import OutsideAlerter from "../../../hooks/useClickOutside";
import AddLineIcon from "remixicon-react/AddLineIcon";
import { useDispatch } from "react-redux";
import { setOpenModal } from "../../../redux/slices/mainState";
import { LocationOutline } from "../../../public/assets/images/svg";
import QuestionLineIcon from "remixicon-react/QuestionLineIcon";
import MyModal from "../../modal";
import useModal from "../../../hooks/useModal";
import ParcelShow from "../../parcel-show";

const CustomSelect = ({
  options = [],
  label = "",
  placeholder = "",
  value,
  name,
  required,
  type = "",
  question,
  invalid,
  onChange = () => {},
  onSuffixClick = () => {},
}) => {
  const { t: tl } = useTranslation();
  let selected = options?.find((item) => item.value == value);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [open, handleOpen, handleClose] = useModal();
  const [parcel, setParcel] = useState(undefined);

  return (
    <div
      className={`form-item interface form-item-dropdown ${
        visible && "active"
      } ${invalid ? "border-danger" : ""}`}
      onClick={() => setVisible(!visible)}
    >
      <div className="label">{tl(label)}</div>
      <div className="plch">{selected ? selected.label : tl(placeholder)}</div>
      <ArrowDownSLineIcon className="suffix" size={20} />
      <OutsideAlerter visible={visible} setVisible={setVisible}>
        <div className="option">
          {options?.length === 0 && type === "address" && (
            <div
              className="add-address-btn"
              onClick={() => dispatch(setOpenModal(true))}
            >
              <AddLineIcon />
              <span>{tl("Add new address")}</span>
            </div>
          )}
          {options?.map((item, idx) => {
            return (
              <div
                key={item.value}
                className="option-item"
                onClick={() => onChange(item)}
              >
                <div className="status">
                  <input
                    onChange={() => {}}
                    required={required}
                    type="radio"
                    id="option"
                    name={name}
                    value={selected?.value}
                    checked={selected?.value === item.value}
                  />
                </div>
                <label htmlFor="#option" className="label">
                  {type === "time" ? item.label : tl(item.label)}{" "}
                  {item.data && (
                    <span className="text-muted text-xsm">
                      (up.to.weight {Number(item.data?.max_g) / 1000}kg)
                    </span>
                  )}
                </label>
                {question && (
                  <div
                    onClick={(e) => {
                      handleOpen();
                      onSuffixClick({ e, item });
                      setParcel(item?.data);
                    }}
                  >
                    <QuestionLineIcon size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </OutsideAlerter>

      {parcel && (
        <MyModal
          size="lg"
          title={parcel.type}
          visible={open}
          handleClose={handleClose}
        >
          <ParcelShow parcel={parcel} />
        </MyModal>
      )}
    </div>
  );
};

export default CustomSelect;
