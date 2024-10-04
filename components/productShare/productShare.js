import React from "react";
import ShareLineIcon from "remixicon-react/ShareLineIcon";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import getBrowserName from "../../utils/getBrowserName";
// Dynamic Link
const DYNAMIC_LINK_DOMAIN = process.env.NEXT_PUBLIC_DYNAMIC_LINK_DOMAIN;
const DYNAMIC_LINK_ANDROID =
  process.env.NEXT_PUBLIC_DYNAMIC_LINK_ANDROID_PACKAGE_NAME;
const DYNAMIC_LINK_IOS = process.env.NEXT_PUBLIC_DYNAMIC_LINK_IOS_BUNDLE_ID;
//Base urls
const WEBSITE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// firebase
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function ProductShare({ data }) {
  const { t } = useTranslation();

  function generateShareLink() {
    const productLink = `${WEBSITE_URL}/product/${data.uuid}`;
    const payload = {
      dynamicLinkInfo: {
        domainUriPrefix: DYNAMIC_LINK_DOMAIN,
        link: productLink,
        androidInfo: {
          androidPackageName: DYNAMIC_LINK_ANDROID,
          androidFallbackLink: productLink,
        },
        iosInfo: {
          iosBundleId: DYNAMIC_LINK_IOS,
          iosFallbackLink: productLink,
        },
        socialMetaTagInfo: {
          socialTitle: data?.translation?.title,
          socialDescription: data?.translation?.description,
          socialImageLink: data.img,
        },
      },
    };
    const browser = getBrowserName();

    if (browser === "Safari" || browser === "Google Chrome") {
      copyToClipBoardSafari(payload);
    } else {
      copyToClipBoard(payload);
    }
  }

  function copyToClipBoardSafari(payload) {
    const clipboardItem = new ClipboardItem({
      "text/plain": axios
        .post(
          `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${API_KEY}`,
          payload
        )
        .then((result) => {
          if (!result) {
            return new Promise(async (resolve) => {
              toast.error("Failed to generate link!");
              //@ts-expect-error
              resolve(new Blob[""]());
            });
          }

          const copyText = result.data.shortLink;
          return new Promise(async (resolve) => {
            toast.success(t("copied"));
            resolve(new Blob([copyText], { type: "text/plain" }));
          });
        }),
    });
    navigator.clipboard.write([clipboardItem]);
  }

  async function copyToClipBoard(payload) {
    axios
      .post(
        `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${API_KEY}`,
        payload
      )
      .then((result) => {
        const copyText = result.data.shortLink;
        copy(copyText);
      })
      .catch((err) => {
        toast.error("Failed to generate link!");
        console.log("generate link failed => ", err);
      });
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("copied"));
    } catch (err) {
      toast.error("Failed to copy!");
      console.log("copy failed => ", err);
    }
  }
  return (
    <button onClick={generateShareLink}>
      <ShareLineIcon />
    </button>
  );
}
