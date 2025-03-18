import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {switchFile, closeFile} from "../../../redux/fileSlice.ts";

const Files: React.FC = () => {
  const {files, currentFileId} = useSelector((state: RootState) => state.files);
  const dispatch = useDispatch()
  const basicTabClasses = ' group py-2 px-6 relative transition'
  const activeTabClasses = ' bg-gray-400'
  const unActiveTabClasses = ' hover:bg-gray-200'

  return <div className="flex flex-row items-center text-sm select-none">
    {
      Object.values(files).map(file => {
        const _curr = file.id === currentFileId
        const currentTabClasses = basicTabClasses + (_curr ? activeTabClasses : unActiveTabClasses)
        const currCloseIconClasses: string = (_curr ? 'block' : 'hidden') + ' w-2 h-2 opacity-50 hover:opacity-100 group-hover:block w-2 h-2 cursor-pointer absolute right-2 top-0'

        return <div key={file.id}
                    className={currentTabClasses}
                    onClick={() => {
                      dispatch(switchFile(file.id))
                    }}>
          <span>{file.name}</span>
          <span
            onClick={(e) => {
              dispatch(closeFile(file.id))
              e.preventDefault()
              e.stopPropagation()
            }}
            className={currCloseIconClasses}>&times;</span>
        </div>
      })
    }
  </div>
};

export default Files