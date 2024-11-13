import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import {Button, Form, FormFeedback} from 'reactstrap';
import Loader4LineIcon from 'remixicon-react/Loader4LineIcon';
import {UserApi} from '../../api/main/user';
import {setVisibleAuth} from '../../redux/slices/mainState';
import InputPassword from '../form/form-item/InputPassword';

const UpdatePassword = ({email}) => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const {t: tl} = useTranslation();
  const [userData, setUserData] = useState({});
  const [validate, setValidate] = useState(null);

  console.log(email.replace(/\s/g, ''));
  console.log('==================email================');

  const checkPassword = () => {
    if (
      userData.password &&
      userData.password === userData.password_confirmation
    ) {
      setValidate('check');
    } else {
      setValidate('checked');
    }
  };

  const handleChange = event => {
    const {name, value} = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleUpdatePassword = async e => {
    e.preventDefault();

    if (!email) {
      toast.error(tl('Phone number is required'));
      return;
    }

    if (validate !== 'check') {
      toast.error(tl('Passwords do not match'));
      return;
    }

    setLoader(true);
    try {
      await UserApi.passwordUpdate({
        ...userData,
        phone: email.replace(/\s/g, ''),
      });
      toast.success(tl('Password updated successfully'));
      dispatch(setVisibleAuth(false));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || tl('Failed to update password'),
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="auth">
      <div className="title">{tl('Update password')}</div>
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
            validate === 'check'
              ? 'success'
              : validate === 'checked'
              ? 'error'
              : ''
          }
        />
        <FormFeedback tooltip valid={validate === 'check'}>
          {validate === 'check'
            ? tl('Passwords match')
            : tl('Passwords do not match')}
        </FormFeedback>
        <Button data-loader={loader} type="submit" disabled={loader}>
          {loader ? <Loader4LineIcon /> : tl('Update')}
        </Button>
      </Form>
    </div>
  );
};

export default UpdatePassword;
