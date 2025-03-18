import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {switchFile} from "../../../redux/fileSlice.ts";
import {HTMLProps} from "react";

const Files: React.FC = () => {
  const {files, currentFileId} = useSelector((state: RootState) => state.files);
  const dispatch = useDispatch()
  const basicTabClasses = ' group py-2 px-4 pr-4 relative transition'
  const activeTabClasses = ' bg-gray-400'
  const unActiveTabClasses = ' hover:bg-gray-200'
  return <div className="flex flex-row items-center text-sm select-none">
    {
      Object.values(files).map(file => {
        const _curr = file.id === currentFileId
        const currentTabClasses = basicTabClasses + (_curr ? activeTabClasses : unActiveTabClasses)
        const currCloseIconClasses: tailwindCSS.classAttributes = (_curr ? 'block' : 'hidden') + ' group-hover:block w-2 h-2 absolute right-0 top-0'

        return <div key={file.id}
                    className={currentTabClasses}
                    onClick={() => {
                      dispatch(switchFile(file.id))
                    }}>
          <span>{file.name}</span>
          <span
            onClick={(e) => {
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