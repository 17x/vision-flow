import Select from "../lib/select/select.tsx"
import {useTranslation} from "react-i18next"
import {useState} from "react"

type LanguageCode = 'en' | 'cn' | 'jp'

const LanguageSwitcher: React.FC = () => {
  const [language, setLanguage] = useState<LanguageCode>('en')
  const languageRecord: Record<LanguageCode, string> = {
    "en": "English",
    "cn": "中文",
    "jp": "日本語"
  }

  const {i18n} = useTranslation()

  return <div className="flex flex-row items-center text-sm select-none">
    <Select defaultValue={languageRecord[language]}>
      {
        (Object.keys(languageRecord) as LanguageCode[]).map((langCode, index) =>
          <div key={index} onClick={() => {
            i18n.changeLanguage(langCode)
            setLanguage(langCode)
          }}>
            {languageRecord[langCode]}
          </div>)
      }
    </Select>
  </div>
}

export default LanguageSwitcher