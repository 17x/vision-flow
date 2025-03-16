import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import enTranslations from './en/translation.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      }
    },
    lng: "en",
    fallbackLng: "en",
    // returnObject: true,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;