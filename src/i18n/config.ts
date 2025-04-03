import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import enMenu from './en/menu.json'
import enHistory from './en/history.json'
import cnMenu from './cn/menu.json'
import cnHistory from './cn/history.json'
import jpMenu from './jp/menu.json'
import jpHistory from './jp/history.json'

const en = {
  translation: {
    ...enMenu,
    ...enHistory,
  }
}
const cn = {
  translation: {
    ...cnMenu,
    ...cnHistory,
  }
}
const jp = {
  translation: {
    ...jpMenu,
    ...jpHistory,
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      cn,
      jp
    },
    lng: "en",
    fallbackLng: "en",
    // returnObject: true,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n