import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form } from "reactstrap";
import Loader4LineIcon from "remixicon-react/Loader4LineIcon";
import { MainContext } from "../../context/MainContext";
import InputPhone from "../form/form-item/InputPhone";

const ForgotPassword = ({
  setEmail,
  email,
  loader,
  getOtpCode,
  error,
  setError,
}) => {
  const { handleAuth } = useContext(MainContext);
  const { t: tl } = useTranslation();
  useEffect(() => {
    return () => {
      setEmail("");
      setError(null);
    };
  }, []);

  useEffect(() => {
    return;
  }, []);
  return (
    <div className="auth">
      <div className="title">{tl("Forgot password")}</div>
      <Form autoComplete="off" onSubmit={getOtpCode}>
        <InputPhone
          name="number"
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          value={email}
        />
        <Button type="submit" data-loader={loader} id="sign-in-button">
          <Loader4LineIcon />
          {tl("Submit")}
        </Button>
        <div className="sign-up">
          <span>{tl("Back to sign in")}</span>
          <span className="to-register" onClick={() => handleAuth("login")}>
            {tl("Sign in")}
          </span>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;
