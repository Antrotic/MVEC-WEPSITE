import React, { useContext } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosService from "../../services/axios";
import { MainContext } from "../../context/MainContext";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModal, setVisibleAuth } from "../../redux/slices/mainState";
import { setCookie } from "nookies";
import UpdatePassword from "./update-password";
import { savedUser } from "../../redux/slices/user";
import { AuthContext } from "../../context/AuthContext";
import ConfirmForgot from "./confirm-forgot";
const MyModal = dynamic(() => import("../modal"));
const Login = dynamic(() => import("./login"));
const Register = dynamic(() => import("./register"));
const SocialAuth = dynamic(() => import("./social"));
const SignUpForm = dynamic(() => import("./sign-up-form"));
const Confirm = dynamic(() => import("./confirm"));
const ForgotPassword = dynamic(() => import("./forgot-password"));

const Auth = () => {
  const { handleAuth } = useContext(MainContext);
  const { phoneNumberSignIn } = useContext(AuthContext);

  const authContent = useSelector((state) => state.mainState.authContent);
  const visibleAuth = useSelector((state) => state.mainState.visibleAuth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isTimeOver, setIsTimeOver] = useState(null);
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [otp, setOtp] = useState(null);
  const [callback, setCallback] = useState(undefined);
  const [userData, setUserData] = useState({});

  const getOtpCode = (e) => {
    e.preventDefault();
    setLoader(true);
    phoneNumberSignIn(email)
      .then((res) => {
        setCallback(res);
        setLoader(false);
        if (authContent === "forgotPassword") handleAuth("confirmForgot");
        else handleAuth("confirm");
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
        setError(error?.message);
      });
  };
  const handleConfirm = () => {
    callback
      .confirm(otp || "")
      .then(() => handleAuth("formfull"))
      .catch(() => setError("verify.error"));
  };
  const handleConfirmPasswordReset = () => {
    callback
      .confirm(otp || "")
      .then(() => handleAuth("updatePassword"))
      .catch(() => setError("verify.error"));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    axiosService
      .post("/auth/after-verify", {
        ...userData,
        phone: email?.replace(/\s/g, ""),
      })
      .then(
        ({
          data: {
            data: { token, user },
          },
        }) => {
          setCookie(null, "access_token", token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
          dispatch(savedUser(user));
          setLoader(false);
          dispatch(setVisibleAuth(false));
          if (router.query.invite) {
            router.push(`/invite/${router.query.invite}`);
          } else router.push("/");
        }
      )
      .catch((error) => {
        setLoader(false);
        console.log(error);
        setError(error.message);
        toast.error(error.message);
      });
  };

  return (
    <MyModal
      className="auth"
      visible={visibleAuth}
      centered={true}
      setVisible={() => {
        return setOpenModal;
      }}
    >
      {authContent === "login" && <Login />}
      {authContent === "email" && (
        <SignUpForm
          loader={loader}
          setEmail={setEmail}
          email={email}
          setCallback={setCallback}
          getOtpCode={getOtpCode}
          error={error}
          setError={setError}
        />
      )}
      {authContent === "confirm" && (
        <Confirm
          loader={loader}
          otp={otp}
          setOtp={setOtp}
          email={email}
          isTimeOver={isTimeOver}
          setIsTimeOver={setIsTimeOver}
          handleConfirm={handleConfirm}
          setCallback={setCallback}
          getOtpCode={getOtpCode}
          error={error}
        />
      )}
      {authContent === "confirmForgot" && (
        <ConfirmForgot
          loader={loader}
          otp={otp}
          setOtp={setOtp}
          email={email}
          isTimeOver={isTimeOver}
          setIsTimeOver={setIsTimeOver}
          handleConfirm={handleConfirm}
          setCallback={setCallback}
          handleConfirmPasswordReset={handleConfirmPasswordReset}
          error={error}
          setError={setError}
        />
      )}
      {authContent === "formfull" && (
        <Register
          loader={loader}
          userData={userData}
          setUserData={setUserData}
          onSubmit={onSubmit}
          error={error}
          setError={setError}
        />
      )}
      {authContent === "forgotPassword" && (
        <ForgotPassword
          email={email}
          setEmail={setEmail}
          loader={loader}
          getOtpCode={getOtpCode}
          error={error}
          setError={setError}
        />
      )}
      {authContent === "updatePassword" && (
        <UpdatePassword email={email} error={error} setError={setError} />
      )}
      {(authContent == "login" || authContent === "email") && <SocialAuth />}
    </MyModal>
  );
};

export default Auth;
