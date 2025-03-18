import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {DynamicIcon} from 'lucide-react/dynamic';
import {LayerDown, LayerToBottom, LayerToTop, LayerUp} from "./Icons/LayerIcons.tsx";

const Toolbar: React.FC = () => {
  const actions = useSelector((state: RootState) => state.toolbar.actions);

  return <div className={'h-10 inline-flex pl-4 items-center border-b border-gray-200 box-border'}>
    {
      Object.values(actions).map((action) => {
        const {id, icon, disabled, divide} = action;
        let Icon = <DynamicIcon size={20} name={icon}/>

        if (id === 'layerUp') {
          Icon = <LayerUp size={20} className={'text-black'}/>
        }
        if (id === 'layerDown') {
          Icon = <LayerDown size={20} className={'text-black'}/>
        }
        if (id === 'layerTop') {
          Icon = <LayerToTop size={20} className={'text-black'}/>
        }
        if (id === 'layerBottom') {
          Icon = <LayerToBottom size={20} className={'text-black'}/>
        }

        return <>
          <button type={'button'} key={id} disabled={disabled}
                  className={'relative ml-2 mr-2 flex items-center cursor-pointer justify-center w-6 h-6 opacity-50   hover:bg-gray-200  hover:opacity-100 disabled:text-gray-200 disabled:cursor-default'}>
            {Icon}
          </button>
          {divide && <div className={'w-[1px] h-4 bg-gray-400 mx-2'}></div>}</>
      })
    }
  </div>
};

export default Toolbar