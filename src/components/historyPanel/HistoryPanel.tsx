import {useContext, useEffect, useRef} from 'react'
import EditorContext from '../../contexts/editorContext/EditorContext.tsx'
import {useTranslation} from 'react-i18next'
import {I18nHistoryDataItem} from '../../i18n/type'
import {Con, Flex, Panel} from '@lite-u/ui'

export const HistoryPanel = () => {
  const {state: {historyArray, historyStatus}, applyHistoryNode} = useContext(EditorContext)
  const {t} = useTranslation()
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (targetRef.current) {

      return () => {

      }
    }
  }, [historyArray, historyStatus])

  return (
    <Con fh ovh p={10}>
      <Panel title={'History'}
             className={'overflow-hidden h-full'}
             boxStyle={{
               overflow: 'hidden',
             }}>
        <Con fh ovh p={8}>
          <Con fh className={'border border-gray-200 overflow-x-hidden scrollbar-custom overflow-y-auto'}>
            <Flex col p={10} className={'  min-h-40 bg-gray-100'} style={{
              boxShadow: 'inset 0 0 3px 1px #000',
            }}>
              {
                historyArray.map((historyNode, index) => {
                    const isCurr = historyNode.id === historyStatus.id
                    const prefixI18NKey = 'history.' + historyNode.data.type
                    const {label, tooltip} = t(prefixI18NKey, {returnObjects: true}) as I18nHistoryDataItem

                    return <Con key={index}
                                title={tooltip}
                                ref={isCurr ? targetRef : null}
                                onClick={() => {
                                  if (isCurr) return
                                  // console.log(historyNode.id)
                                  applyHistoryNode(historyNode)
                                }}
                                className={` px-2 py-1 cursor-pointer text-xs hover:bg-gray-400 hover:text-white ${isCurr ? 'bg-gray-400 text-white' : ''}`}>
                      <span>{label}</span>
                    </Con>
                  },
                )
              }
            </Flex>
          </Con></Con>
      </Panel>
    </Con>
  )
}