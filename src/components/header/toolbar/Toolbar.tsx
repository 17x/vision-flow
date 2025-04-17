import {LayerDown, LayerToBottom, LayerToTop, LayerUp} from './Icons/LayerIcons.tsx'
import {Fragment, memo, ReactNode, useContext} from 'react'
import EditorContext from '../../editorContext/EditorContext.tsx'
import {NamedIcon} from '../../lib/icon/icon.tsx'
import {t} from 'i18next'
import {I18nHistoryDataItem} from '../../../i18n/type'
import {MenuItemType} from '../menu/type'

const IconSize = 20
const IconColor = 'text-black'

const Toolbar: React.FC = memo(() => {
    const {executeAction, historyStatus, selectedModules} = useContext(EditorContext)

    const actions: MenuItemType[] = [
      {id: 'save', icon: 'save', disabled: true, divide: true},
      {id: 'undo', editorActionCode: 'history-undo', icon: 'undo', disabled: !historyStatus.hasPrev},
      {id: 'redo', editorActionCode: 'history-redo', icon: 'redo', disabled: !historyStatus.hasNext, divide: true},
      {
        id: 'delete',
        editorActionCode: 'module-delete',
        icon: 'trash',
        disabled: selectedModules.length === 0,
        divide: true,
      },
      // {id: 'add', icon: 'cross', disabled: false, divide: true},
      {id: 'layerUp', editorActionCode: 'module-layer', editorActionData: 'up', icon: 'layers', disabled: false},
      {id: 'layerDown', editorActionCode: 'module-layer', editorActionData: 'down', icon: 'layers', disabled: false},
      {id: 'layerTop', editorActionCode: 'module-layer', editorActionData: 'top', icon: 'layers', disabled: false},
      {
        id: 'layerBottom',
        editorActionCode: 'module-layer',
        editorActionData: 'bottom',
        icon: 'layers',
        disabled: false,
        divide: true,
      },
      /*{id: 'group', icon: 'group', disabled: true},
      {id: 'ungroup', icon: 'ungroup', disabled: true, divide: true},
      {id: 'lock', icon: 'lock', disabled: false},
      {id: 'unlock', icon: 'unlock', disabled: true},*/
    ]

    return <div className={'border-b border-gray-200 box-border'}>
      <div className={'h-10 inline-flex pl-4 items-center'}>
        {
          Object.values(actions).map((item) => {
            const {id, icon, disabled, divide} = item
            let Icon: ReactNode

            switch (id) {
              case 'layerUp':
                Icon = <LayerUp size={IconSize} className={IconColor}/>
                break
              case 'layerDown':
                Icon = <LayerDown size={IconSize} className={IconColor}/>
                break
              case 'layerTop':
                Icon = <LayerToTop size={IconSize} className={IconColor}/>
                break
              case 'layerBottom':
                Icon = <LayerToBottom size={IconSize} className={IconColor}/>
                break
              default:
                Icon = <NamedIcon size={IconSize} iconName={icon!}/>
                break
            }

            const {tooltip} = t(id, {returnObjects: true}) as I18nHistoryDataItem

            return <Fragment key={id}>
              <button type={'button'}
                      disabled={disabled}
                      title={tooltip}
                      onClick={() => {
                        item.editorActionCode && executeAction(item.editorActionCode)
                      }}
                      className={'relative ml-1 rounded-sm mr-1 flex items-center cursor-pointer justify-center w-6 h-6   hover:bg-gray-200  hover:opacity-100  disabled:hover:bg-transparent disabled:text-gray-200 disabled:cursor-default'}>
                {Icon}
              </button>
              {divide && <div className={'w-[1px] h-4 bg-gray-400 mx-2'}></div>}
            </Fragment>
          })
        }
      </div>
    </div>
  },
)
export default Toolbar