import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {DynamicIcon} from 'lucide-react/dynamic';
import {LayerDown, LayerToBottom, LayerToTop, LayerUp} from "./Icons/LayerIcons.tsx";

const Toolbar: React.FC = () => {
  const actions = useSelector((state: RootState) => state.toolbar.actions);

  console.log(actions)
  return <div className={'h-10 flex border-b border-gray-200 box-border'}>
    {
      Object.values(actions).map((action) => {
        const {id, icon, disabled} = action;
        let Icon = <DynamicIcon name={icon}/>

        console.log(id)

        if (id === 'layerUp') {
          Icon = <LayerUp className={'text-black'}/>
        }
        if (id === 'layerDown') {
          Icon = <LayerDown className={'text-black'}/>
        }
        if (id === 'layerTop') {
          Icon = <LayerToTop className={'text-black'}/>
        }
        if (id === 'layerBottom') {
          Icon = <LayerToBottom className={'text-black'}/>
        }

        return <button type={'button'} key={id} disabled={disabled}
                       className={'relative flex items-center justify-center w-8 h-8 hover:bg-gray-400 disabled:text-gray-200'}>
          {Icon}
          {/*{id === 'layerUp' && <DynamicIcon size={18} className={'absolute top-0 right-0 text-black'} color={'#ff0000'} name={'arrow-up'}/>}*/}
          {/*{id === 'layerDown' && <DynamicIcon size={18} className={'absolute top-0 right-0 text-black'} color={'#ff0000'} name={'arrow-down'}/>}*/}


        </button>
      })
    }
  </div>
};

export default Toolbar