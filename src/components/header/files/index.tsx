import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {switchFile} from "../../../redux/fileSlice.ts";

const Files: React.FC = () => {
  const {files, currentFileId} = useSelector((state: RootState) => state.files);
  const dispatch = useDispatch()
  const activeFileTabClasses: string = 'bg-gray-400'

  return <div className="flex flex-row items-center text-sm select-none">
    {
      Object.values(files).map(file => {

        return <div key={file.id}
                    className={'peer py-2 px-3  relative hover:bg-gray-400 transition ' + (file.id === currentFileId ? activeFileTabClasses : '')}
                    onClick={() => {
                      dispatch(switchFile(file.id))
                    }}>
          {file.name}
          <span className={'absolute right-0 top-0 hidden peer-hover:block'}>&times;</span>
        </div>
      })
    }
  </div>
};

export default Files