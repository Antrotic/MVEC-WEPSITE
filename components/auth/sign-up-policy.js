import React, { useEffect, useState } from "react";
import axiosService from "../../services/axios";
import { parseCookies } from "nookies";
import ListLoader from "../loader/list";
import { Button } from "reactstrap";
import { useTranslation } from "react-i18next";

const SignUpPolicy = ({ onConfirm }) => {
  const [policy, setPolicy] = useState();
  const [loading, setLoading] = useState(false);
  const cookies = parseCookies();
  const { t: tl } = useTranslation();
  const language_locale = cookies?.language_locale;

  const fetchPolicy = async () => {
    setLoading(true);
    const policy = await axiosService
      .get(`/rest/policy`, {
        params: { lang: language_locale },
      })
      .finally(() => setLoading(false));

    setPolicy(policy?.data);
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  if (loading) {
    return (
      <div className="sign-up-policy">
        <ListLoader />
        <ListLoader />
        <ListLoader />
        <ListLoader />
        <ListLoader />
        <ListLoader />
      </div>
    );
  }

  return (
    <div className="sign-up-policy">
      <div className="title">
        <div
          className="termofuse"
          dangerouslySetInnerHTML={{
            __html: policy?.data?.translation?.title,
          }}
        />
      </div>
      <div className="termofuse">
        <div
          className="typography"
          dangerouslySetInnerHTML={{
            __html: policy?.data?.translation?.description,
          }}
        />
      </div>
      <div className="confirm-policy">
        <Button onClick={() => onConfirm()}>{tl("Confirm")}</Button>
      </div>
    </div>
  );
};

export default SignUpPolicy;
