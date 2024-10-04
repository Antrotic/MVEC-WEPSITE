import React, { useEffect } from "react";
import OtpInput from "react-otp-input";
import RefreshLineIcon from "remixicon-react/RefreshLineIcon";
import Countdown from "../../utils/countDown";
import { useTranslation } from "react-i18next";
import Loader4LineIcon from "remixicon-react/Loader4LineIcon";

const Confirm = ({
  isTimeOver,
  setIsTimeOver,
  email,
  setOtp,
  otp,
  handleConfirm,
  loader,
  getOtpCode,
  mode,
  handleConfirmPasswordReset,
  error,
  setError,
}) => {
  const { t: tl } = useTranslation();

  const handleChange = (otp) => setOtp(otp);

  const handleResend = () => {
    setIsTimeOver(null);
    if (mode === "forgotPassword") handleConfirmPasswordReset();
    else getOtpCode();
  };

  useEffect(() => {
    return () => {
      setOtp("");
      setError(null);
    };
  }, []);

  return (
    <div className="confirm">
      <div className="sent-gmail">{`${tl("sent-code")} ${email}`}</div>
      <OtpInput
        value={otp}
        onChange={handleChange}
        numInputs={6}
        separator={""}
        className="otp-input"
      />
      <span
        className="invalid-feedback"
        style={{ display: Boolean(error) ? "block" : "" }}
      >
        {error}
      </span>
      <div className="btn-group">
        <button
          data-loader={loader}
          className="btn-success confirm-btn"
          onClick={handleConfirm}
        >
          <Loader4LineIcon />
          {tl("Confirm")}
        </button>
        {isTimeOver ? (
          <button className="btn-dark" onClick={handleResend}>
            <RefreshLineIcon size={28} />
          </button>
        ) : (
          <button className="btn-dark">
            <Countdown isTimeOver={isTimeOver} setIsTimeOver={setIsTimeOver} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Confirm;
