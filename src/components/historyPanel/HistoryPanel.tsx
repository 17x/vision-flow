import {memo, useContext, useEffect, useRef} from 'react'
import EditorContext from '../editorContext/EditorContext.tsx'
import {useTranslation} from 'react-i18next'
import {I18nHistoryDataItem} from '../../i18n/type'

export const HistoryPanel = memo(() => {
  const {historyArray, historyStatus, applyHistoryNode} = useContext(EditorContext)
  const {t} = useTranslation()
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (targetRef.current) {

      return () => {

      }
    }
  }, [historyArray, historyStatus])

  return (
    <div className={'p-2'}>
      <h1 className={'bg-gray-600 text-white px-2'}><span>History</span></h1>
      <div className={'border h-50 border-gray-200 overflow-x-auto scrollbar-custom overflow-y-auto'}>
        <div className={'flex flex-col m-2 border border-gray-200 min-h-40 bg-gray-100'}>
          {
            historyArray.map((historyNode, index) => {
                const isCurr = historyNode.id === historyStatus.id
                const prefixI18NKey = 'history.' + historyNode.data.type
                const {label, tooltip} = t(prefixI18NKey, {returnObjects: true}) as I18nHistoryDataItem

                return <div key={index}
                            title={tooltip}
                            ref={isCurr ? targetRef : null}
                            onClick={() => {
                              if (isCurr) return
                              // console.log(historyNode.id)
                              applyHistoryNode(historyNode)
                            }}
                            className={` px-2 py-1 cursor-pointer text-xs hover:bg-gray-400 hover:text-white ${isCurr ? 'bg-gray-400 text-white' : ''}`}>
                  <span>{label}</span>
                </div>
              },
            )
          }
        </div>
      </div>
    </div>
  )
})