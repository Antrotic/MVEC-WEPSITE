import React from "react";
import { useRouter } from "next/router";
import { t } from "i18next";
import { Button } from "reactstrap";

export default function ParcelCard() {
  const { push } = useRouter();

  return (
    <div className="container parcel-wrapper">
      <div className={"wrapper"}>
        <img src="/assets/images/parcel-3.jpg" alt="Parcel" />
        <div className={"backdrop"} />
        <div className={"brandLogo"}>{/* <BrandLogoDark /> */}</div>
        <div className={"body"}>
          <h1 className={"title"}>{t("door.to.door.delivery")}</h1>
          <p className={"caption"}>{t("door.to.door.delivery.service")}</p>
          <div className={"actions"}>
            <Button onClick={() => push("/parcel-checkout")} outline>
              {t("learn.more")}
            </Button>
          </div>
        </div>
      </div>
      <div className={"space"} />
    </div>
  );
}
