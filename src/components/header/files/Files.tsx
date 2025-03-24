import {DynamicIcon} from "lucide-react/dynamic";
import {useContext} from "react";
import FileContext from "../../fileContext/FileContext.tsx";

const Files: React.FC = () => {
  const basicTabClasses = ' group py-2 px-6 relative transition flex items-center">'
  const activeTabClasses = ' border-b-2 border-black-600'
  const unActiveTabClasses = ' hover:bg-gray-200'
  const {files, currentFileId, closeFile, switchFile, handleCreating} = useContext(FileContext)
  return <div className="flex flex-row items-center text-sm select-none">
    {
      Object.values(files).map(file => {
        const _curr = file.id === currentFileId
        const currentTabClasses = basicTabClasses + (_curr ? activeTabClasses : unActiveTabClasses)
        const currCloseIconClasses: string = (_curr ? 'visible' : 'invisible') + ' w-2 h-2 ml-4 opacity-50 hover:opacity-100 group-hover:visible w-2 h-2 cursor-pointer'

        return <div key={file.id}
                    className={currentTabClasses}
                    onClick={() => {
                      switchFile(file.id)
                    }}>
          <span>{file.name}</span>
          <span
            onClick={(e) => {
              closeFile(file.id)
              e.preventDefault()
              e.stopPropagation()
            }}
            className={currCloseIconClasses}>&times;</span>
        </div>
      })
    }

    <button>
      <DynamicIcon name={'plus'} size={18} onClick={() => {
        handleCreating(true)
      }}/>
    </button>
  </div>
};

export default Files