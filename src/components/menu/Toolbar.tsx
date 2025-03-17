import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {DynamicIcon} from 'lucide-react/dynamic';

const Toolbar: React.FC = () => {
  const actions = useSelector((state: RootState) => state.toolbar.actions);

  console.log(actions)
  return <div className={'h-10 flex border-b border-gray-200 box-border'}>
    {
      Object.values(actions).map((action) => {
        const {id, icon, disabled} = action;
        return <button type={'button'} key={id} disabled={disabled} className={'relative disabled:text-gray-200'}>
          <DynamicIcon name={icon}/>
          {id === 'layerUp' && <DynamicIcon size={16} className={'absolute top-0 right-0'} name={'arrow-up'}/>}
          {id === 'layerDown' && <DynamicIcon size={16} className={'absolute top-0 right-0'} name={'arrow-down'}/>}
        </button>
      })
    }
  </div>
};

export default Toolbar