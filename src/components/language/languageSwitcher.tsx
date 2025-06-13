import {useTranslation} from 'react-i18next'
import {useState} from 'react'
import Select from '@lite-u/ui/select'
import SelectItem from '@lite-u/ui/selectItem'

type LanguageCode = 'en' | 'cn' | 'jp'

const LanguageSwitcher: React.FC = () => {
  const [language, setLanguage] = useState<LanguageCode>('en')
  const languageRecord: Record<LanguageCode, string> = {
    'en': 'English',
    'cn': '中文',
    'jp': '日本語',
  }

  const {i18n} = useTranslation()
  return <div className="flex flex-row items-center text-sm select-none">
    <Select selectValue={language} onSelectChange={(langCode) => {
      i18n.changeLanguage(langCode as LanguageCode)
      setLanguage(langCode as LanguageCode)
    }}>
      {
        (Object.keys(languageRecord) as LanguageCode[]).map((langCode, index) => {
          return <SelectItem key={index} value={langCode}>{languageRecord[langCode]}</SelectItem>
        })
      }
    </Select>
    {/*<Select1 defaultValue={languageRecord[language]}>
      {
        (Object.keys(languageRecord) as LanguageCode[]).map((langCode, index) =>
          <div key={index} onClick={() => {
            i18n.changeLanguage(langCode)
            setLanguage(langCode)
          }}>
            {languageRecord[langCode]}
          </div>)
      }
    </Select1>*/}
  </div>
}

export default LanguageSwitcher