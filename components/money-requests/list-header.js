import React from "react";
import { useTranslation } from "react-i18next";

export default function ListHeader() {
    const { t: tl } = useTranslation();
    return (
        <div className="list-header rounded-3">
            <div className="head-data text-center text-md-start">
                {tl("Phone number")}
            </div>
            <div className="head-data text-center text-md-start">
                {tl("Username")}
            </div>
            <div className="head-data text-center text-md-start">{tl("Amount")}</div>
            <div className="head-data text-center text-md-start">{tl("Status")}</div>
            <div className="head-data"/>
        </div>
    );
}
