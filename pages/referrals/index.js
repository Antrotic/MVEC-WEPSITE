import React, { useEffect, useState } from "react";
import cls from "./referralContainer.module.scss";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Button } from "reactstrap";
import { parseCookies } from "nookies";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getPrice } from "../../utils/getPrice";
import Footer from "../../components/footer";
import informationService from "../../services/informationService";
import ErrorBoundary from "../../components/error";

export default function ReferralContainer() {
  const { t } = useTranslation();
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = Boolean(parseCookies()?.access_token);
  const user = useSelector((state) => state.user.data, shallowEqual);
  const copyToClipBoard = async () => {
    if (!isAuthenticated) {
      toast.warning(t("login.first"));
      return;
    }
    try {
      await navigator.clipboard.writeText(user?.my_referral || "");
      toast.success(t("copied"));
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };

  const shareReferral = async () => {
    if (!isAuthenticated) {
      toast.warning(t("login.first"));
      return;
    }
    try {
      await navigator.clipboard.writeText(
        process.env.NEXT_PUBLIC_BASE_URL +
          "/register?referral_code=" +
          user?.my_referral
      );
      toast.success(t("copied"));
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };

  const getReferrals = () => {
    setLoading(true);
    informationService
      .getReferrals()
      .then((res) => {
        setData(res.data.data);
        setError(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getReferrals();
  }, []);

  return (
    <div className={`container ${cls.container}`}>
      <ErrorBoundary error={error} text="Referrals have not been added yet.">
        {!loading ? (
          <div className={cls.wrapper}>
            <div className={cls.imgWrapper}>
              <img src={data?.img} alt="Referral" />
            </div>
            <div className={cls.main}>
              <>
                <h1 className={cls.title}>{data?.translation?.title}</h1>
                <p className={cls.text}>
                  {data?.translation?.description}
                  <Link href="/referral-terms">{t("referral.terms")}</Link>
                </p>
                <div className={cls.line} />
                <div className={cls.flex}>
                  <div className={cls.flexItem}>
                    <span>{t("balance")}: </span>
                    {getPrice(user?.referral_from_topup_price)}
                  </div>
                  <div className={cls.flexItem}>
                    <span>{t("referrals")}: </span>
                    <span>{user?.referral_from_topup_count}</span>
                  </div>
                </div>
              </>
              <div className={cls.actions}>
                <Button onClick={shareReferral}>{t("share")}</Button>
                <Button onClick={copyToClipBoard}>{t("copy.code")}</Button>
              </div>
            </div>
          </div>
        ) : (
          <>loading</>
        )}
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
