import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {DynamicIcon} from 'lucide-react/dynamic';
import {LayerDown, LayerToBottom, LayerToTop, LayerUp} from "./Icons/LayerIcons.tsx";
import {Fragment, ReactNode, useContext} from "react";
import {EditorContext} from "../../EditorContext.tsx";
import {ActionCode} from "../../../engine/editor/editor";

const IconSize = 20
const IconColor = 'text-black'

const Toolbar: React.FC = () => {
  const actions = useSelector((state: RootState) => state.toolbar.actions);
  const {executeAction} = useContext(EditorContext)

  return <div className={'border-b border-gray-200 box-border'}>
    <div className={'h-10 inline-flex pl-4 items-center'}>
      {
        Object.values(actions).map((action) => {
          const {id, icon, disabled, divide} = action;
          let Icon: ReactNode

          switch (id) {
            case 'layerUp':
              Icon = <LayerUp size={IconSize} className={IconColor}/>
              break;
            case 'layerDown':
              Icon = <LayerDown size={IconSize} className={IconColor}/>
              break;
            case 'layerTop':
              Icon = <LayerToTop size={IconSize} className={IconColor}/>
              break;
            case 'layerBottom':
              Icon = <LayerToBottom size={IconSize} className={IconColor}/>
              break;
            default:
              Icon = <DynamicIcon size={IconSize} name={icon}/>
              break;
          }

          return <Fragment key={id}>
            <button type={'button'}
                    disabled={disabled}
                    title={id}
                    onClick={() => {
                      // console.log(id)
                      executeAction(id as ActionCode)
                    }}
                    className={'relative ml-1 rounded-sm mr-1 flex items-center cursor-pointer justify-center w-6 h-6 opacity-50   hover:bg-gray-200  hover:opacity-100 disabled:text-gray-200 disabled:cursor-default'}>
              {Icon}
            </button>
            {divide && <div className={'w-[1px] h-4 bg-gray-400 mx-2'}></div>}
          </Fragment>
        })
      }
    </div>
  </div>
};

export default Toolbar