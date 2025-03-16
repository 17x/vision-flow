import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import enTranslations from './en/translation.json'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {translation: enTranslations},
    },
    lng: "en",
    fallbackLng: "en",
    // returnObjects: true,
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });

export default i18n;