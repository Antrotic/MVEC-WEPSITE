import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loader4LineIcon from "remixicon-react/Loader4LineIcon";
import { MainContext } from "../../context/MainContext";
import { Button, Modal } from "reactstrap";
import dynamic from "next/dynamic";
import InputPhone from "../form/form-item/InputPhone";

const SignUpPolicy = dynamic(() => import("./sign-up-policy"));

const SignUpForm = ({
  setEmail,
  loader,
  email,
  getOtpCode,
  error,
  setError,
}) => {
  const [privacy, setPrivacy] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const { handleAuth } = useContext(MainContext);

  const { t: tl } = useTranslation();

  const handleConfirm = () => {
    setPrivacy(true);
    setIsPolicyOpen(false);
  };

  useEffect(() => {
    return setError(null);
  }, []);
  return (
    <div className="sign-up-form">
      <Modal
        isOpen={isPolicyOpen}
        centered
        toggle={() => setIsPolicyOpen(false)}
      >
        <SignUpPolicy onConfirm={handleConfirm} />
      </Modal>
      <form onSubmit={getOtpCode}>
        <InputPhone
          name="number"
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <div className="privacy">
          <input
            type="checkbox"
            checked={privacy}
            onChange={() => setPrivacy(!privacy)}
          />
          {tl("i agree")}
          <span onClick={() => setIsPolicyOpen(true)}>
            {tl("Privacy and Policy")}
          </span>
        </div>

        <Button
          data-loader={loader}
          disabled={!privacy || !email}
          type="submit"
          className="success"
          id="sign-in-button"
        >
          <Loader4LineIcon />
          {tl("Send sms code")}
        </Button>
        <div className="sign-up">
          <span>{tl("Already have an account?")}</span>
          <span className="to-register" onClick={() => handleAuth("login")}>
            {tl("Sign In")}
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
