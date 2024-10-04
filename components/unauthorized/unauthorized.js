/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useTranslation } from "react-i18next";
import { MainContext } from "../../context/MainContext";
import { useContext } from "react";

export default function Unauthorized({ text, image }) {
  const { t } = useTranslation();

  const { handleAuth } = useContext(MainContext);

  return (
    <div className="unauthorized">
      <div className="unauthorized__img-wrapper">
        <img className="unauthorized__img" src={image} alt="Unauthorized" />
      </div>
      <p className="unauthorized__text">{text}</p>
      <div>
        <button
          onClick={() => handleAuth("login")}
          className="unauthorized__btn"
        >
          {t("login.or.create.account")}
        </button>
      </div>
    </div>
  );
}
