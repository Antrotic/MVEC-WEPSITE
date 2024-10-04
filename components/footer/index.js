import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import subcriptionService from "../../services/subscription";
import InputEmail from "../form/form-item/InputEmail";
import FacebookCircleFillIcon from "remixicon-react/FacebookCircleFillIcon";
import TwitterFillIcon from "remixicon-react/TwitterFillIcon";
import InstagramLineIcon from "remixicon-react/InstagramLineIcon";

const Footer = () => {
  const settings = useSelector((state) => state.settings.data);
  const [email, setEmail] = useState("");
  const { t: tl } = useTranslation();
  const onSubmit = (e) => {
    e.preventDefault();
    subcriptionService
      .create({ email })
      .then(() => {
        setEmail("");
        toast.success("You subscribed successfully!");
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  return (
    <div className="container section">
      <div className="footer">
        <div className="content">
          <div className="item">
            <ul>
              <li className="title">{tl("Contact")}</li>
              <li>{settings?.phone}</li>
              <li>{settings?.address}</li>
            </ul>
            <div className="flex">
              <a
                href={settings["customer_app_ios"]}
                className="item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/assets/images/app-store.webp" alt="App store" />
              </a>
              <a
                href={settings["customer_app_android"]}
                className="item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/assets/images/google-play.webp" alt="Google play" />
              </a>
            </div>
          </div>
          <div className="item">
            <ul>
              <li className="title">{tl("Help")}</li>
              <Link href="/about">
                <li>{tl("About Sundaymart")}</li>
              </Link>
              <Link href="/referrals">
                <li>{tl("Referrals")}</li>
              </Link>
              <Link href="/settings/site-settings">
                <li>{tl("Settings")}</li>
              </Link>
            </ul>
          </div>
          <div className="item">
            <ul>
              <li className="title">{tl("Subscription")}</li>
              <form onSubmit={(e) => onSubmit(e)}>
                <li className="subscription-form">
                  <InputEmail
                    placeholder="example@gmail.com"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                  />
                  <Button type="submit">{tl("Subscribe")}</Button>
                </li>
              </form>
            </ul>
          </div>
        </div>
      </div>
      <footer>
        <div className="social">
          <a
            href={settings["instagram"]}
            className="socialItem"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramLineIcon />
          </a>
          <a
            href={settings["twitter"]}
            className="socialItem"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterFillIcon />
          </a>
          <a
            href={settings["facebook"]}
            className="socialItem"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookCircleFillIcon />
          </a>
        </div>
        <div className="flex">
          <Link className="mutedLink" href="/faq">
            {tl("FAQ")}
          </Link>
          <Link className="mutedLink" href="/term-of-use">
            {tl("Term of use")}
          </Link>
          <Link className="mutedLink" href="/privacy-policy">
            {tl("Privacy Policy")}
          </Link>
        </div>
        <p className="text">
          &copy; {new Date().getFullYear()} {settings?.footer_text}
        </p>
      </footer>
    </div>
  );
};

export default Footer;
