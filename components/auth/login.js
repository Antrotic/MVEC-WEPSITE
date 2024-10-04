import React, { useContext, useState } from "react";
import { Button, Form } from "reactstrap";
import Loader4LineIcon from "remixicon-react/Loader4LineIcon";
import InputPassword from "../../components/form/form-item/InputPassword";
import InputText from "../../components/form/form-item/InputText";
import LockPasswordFillIcon from "remixicon-react/LockPasswordFillIcon";
import { MainContext } from "../../context/MainContext";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCookie } from "nookies";
import { clearUser } from "../../redux/slices/user";
import axiosService from "../../services/axios";
import { useTranslation } from "react-i18next";
import { setVisibleAuth } from "../../redux/slices/mainState";
import Recaptcha from "../recaptcha";

const Login = () => {
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const { handleAuth, getUser } = useContext(MainContext);
  const [userData, setUserData] = useState({});
  const [loader, setLoader] = useState(false);
  const [recaptcha, setRecaptcha] = useState(null);

  const handleRecaptchaChange = (value) => {
    setRecaptcha(value);
  };
  const onFinish = async (e) => {
    e.preventDefault();
    setLoader(true);
    const body = {};
    dispatch(clearUser());
    if (!userData.login?.includes("@")) {
      body.phone = userData.login;
    } else {
      body.email = userData.login;
    }
    body.password = userData.password;
    axiosService
      .post("/auth/login", body)
      .then((res) => {
        setCookie(null, "access_token", res.data.data.access_token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        getUser();
        dispatch(setVisibleAuth(false));
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const onChange = (event) => {
    const { target } = event;
    const value = target.type === "radio" ? target.checked : target.value;
    const { name } = target;

    setUserData({
      ...userData,
      [name]: value.trim(),
    });
  };

  return (
    <div className="auth">
      <div className="title">{tl("Sign In")}</div>
      <Form autoComplete="off" onSubmit={onFinish}>
        <InputText
          onChange={onChange}
          label="Login"
          placeholder="Login"
          name="login"
          required={true}
          value={userData?.login}
        />
        <InputPassword
          onChange={onChange}
          label="Password"
          placeholder="******"
          required={true}
          name="password"
        />
        <div
          onClick={() => handleAuth("forgotPassword")}
          className="forgot-password mb-4"
        >
          <div className="icon">
            <LockPasswordFillIcon size={18} />
          </div>
          <div className="label">{tl("Forgot password")}</div>
        </div>
        <Recaptcha onChange={handleRecaptchaChange} />
        <Button
          data-loader={loader}
          disabled={!Boolean(recaptcha)}
          type="submit"
          className="auth-btn"
        >
          <Loader4LineIcon />
          {tl("Sign In")}
        </Button>
        <div className="sign-up">
          <span>{tl("Do not have an account?")}</span>
          <span className="to-register" onClick={() => handleAuth("email")}>
            {tl("Sign Up")}
          </span>
        </div>
      </Form>
    </div>
  );
};

export default Login;
