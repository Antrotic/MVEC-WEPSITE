import i18n from "i18next";

i18n.init({
  resources: {},
  ns: "translation",
  defaultNS: "translation",
  fallbackLng: "ar",
  debug: false,
  react: {
    wait: true,
  },
});

export default i18n;
