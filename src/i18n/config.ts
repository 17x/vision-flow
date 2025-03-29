import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import enMenu from './en/menu.json'
import enHistory from './en/history.json'

const en = {
  translation: {
    ...enMenu,
    ...enHistory,
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en
    },
    lng: "en",
    fallbackLng: "en",
    // returnObject: true,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n