import ReCAPTCHA from "react-google-recaptcha";
import { parseCookies } from "nookies";

const Recaptcha = ({ onChange }) => {
  const cookies = parseCookies();
  const language_locale = cookies?.language_locale;

  const handleRecaptchaChange = (value) => {
    // Pass the reCAPTCHA response value to the parent component
    onChange(value);
  };

  return (
    <ReCAPTCHA
      sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
      onChange={handleRecaptchaChange}
      hl={language_locale}
    />
  );
};

export default Recaptcha;
