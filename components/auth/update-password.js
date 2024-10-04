import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, FormFeedback } from "reactstrap";
import Loader4LineIcon from "remixicon-react/Loader4LineIcon";
import { UserApi } from "../../api/main/user";
import { setVisibleAuth } from "../../redux/slices/mainState";
import InputPassword from "../form/form-item/InputPassword";

const UpdatePassword = ({ email }) => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const { t: tl } = useTranslation();
  const [userData, setUserData] = useState({});
  const [validate, setValidate] = useState(null);
  const checkPassword = () => {
    if (userData.password === userData.password_confirmation) {
      setValidate("check");
    } else {
      setValidate("checked");
    }
  };

  const handleChange = (event) => {
    const { target } = event;
    const value = target.type === "radio" ? target.checked : target.value;
    const { name } = target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleUpdatePassword = (e) => {
    setLoader(true);
    e.preventDefault();
    UserApi.passwordUpdate({ ...userData, phone: email?.replace(/\s/g, "") })
      .then(() => {
        toast.success(tl("updated.successfully"));
        dispatch(setVisibleAuth(false));
      })
      .catch((error) => error?.message)
      .finally(() => setLoader(false));
  };
  return (
    <div className="auth">
      <div className="title">{tl("Update password")}</div>
      <Form autoComplete="off" onSubmit={handleUpdatePassword}>
        <InputPassword
          name="password"
          label="Password"
          placeholder="********"
          onChange={handleChange}
        />
        <InputPassword
          name="password_confirmation"
          label="Confirm password"
          placeholder="*********"
          onChange={handleChange}
          onBlur={checkPassword}
          className={
            validate === "check"
              ? "success"
              : validate === "checked"
              ? "error"
              : ""
          }
        />
        <FormFeedback tooltip valid>
          Sweet! that name is available
        </FormFeedback>
        <Button data-loader={loader} type="submit">
          <Loader4LineIcon />
          {tl("Update")}
        </Button>
      </Form>
    </div>
  );
};

export default UpdatePassword;
