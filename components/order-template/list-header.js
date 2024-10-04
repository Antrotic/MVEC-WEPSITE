import React from "react";
import { useTranslation } from "react-i18next";

export default function ListHeader() {
  const { t: tl } = useTranslation();
  return (
    <div className="list-header">
      <div className="head-data text-center text-md-start">
        {tl("ID, Store name")}
      </div>
      <div className="head-data text-center text-md-start">
        {tl("Range of date")}
      </div>
      <div className="head-data text-center text-md-start">{tl("Amount")}</div>
      <div className="head-data text-center text-md-start">{tl("Status")}</div>
    </div>
  );
}
