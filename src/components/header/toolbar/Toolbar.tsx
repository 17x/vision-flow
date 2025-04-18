import {LayerDown, LayerToBottom, LayerToTop, LayerUp} from './Icons/LayerIcons.tsx'
import {Fragment, memo, ReactNode, useContext, useReducer, useState} from 'react'
import EditorContext from '../../editorContext/EditorContext.tsx'
import {NamedIcon} from '../../lib/icon/icon.tsx'
import {t} from 'i18next'
import {I18nHistoryDataItem} from '../../../i18n/type'
import {MenuItemType} from '../menu/type'

const IconSize = 20
const IconColor = 'text-black'

const Toolbar: React.FC = () => {
  const {state: {needSave, historyStatus, selectedModules}, executeAction} = useContext(EditorContext)
  const hasSelectedModules = selectedModules.length > 0

  const actions: MenuItemType[] = [
    {id: 'save', action: 'saveFile', icon: 'save', disabled: !needSave, divide: true},
    {id: 'undo', editorActionCode: 'history-undo', icon: 'undo', disabled: !historyStatus.hasPrev},
    {id: 'redo', editorActionCode: 'history-redo', icon: 'redo', disabled: !historyStatus.hasNext, divide: true},
    {
      id: 'delete',
      editorActionCode: 'module-delete',
      icon: 'trash',
      disabled: !hasSelectedModules,
      divide: true,
    },
    // {id: 'add', icon: 'cross', disabled: false, divide: true},
    {
      id: 'layerUp',
      editorActionCode: 'module-layer',
      editorActionData: 'up',
      icon: 'layers',
      disabled: !hasSelectedModules,
    },
    {
      id: 'layerDown',
      editorActionCode: 'module-layer',
      editorActionData: 'down',
      icon: 'layers',
      disabled: !hasSelectedModules,
    },
    {
      id: 'layerTop',
      editorActionCode: 'module-layer',
      editorActionData: 'top',
      icon: 'layers',
      disabled: !hasSelectedModules,
    },
    {
      id: 'layerBottom',
      editorActionCode: 'module-layer',
      editorActionData: 'bottom',
      icon: 'layers',
      disabled: !hasSelectedModules,
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
              Icon = <LayerUp size={IconSize} />
              break
            case 'layerDown':
              Icon = <LayerDown size={IconSize} />
              break
            case 'layerTop':
              Icon = <LayerToTop size={IconSize} />
              break
            case 'layerBottom':
              Icon = <LayerToBottom size={IconSize} />
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
                      if (item.editorActionCode || item.action) {
                        executeAction(item.editorActionCode || item.action)
                      }
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
}
export default Toolbar