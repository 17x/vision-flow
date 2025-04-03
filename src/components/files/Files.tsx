import {useContext} from "react"
import FileContext from "../fileContext/FileContext.tsx"
import {Plus} from "lucide-react";

const Files: React.FC = () => {
  const basicTabClasses = ' group py-2 px-6 relative transition flex items-center">'
  const activeTabClasses = ' border-b-2 border-black-600'
  const unActiveTabClasses = ' hover:bg-gray-200'
  const {fileList, currentFileId, closeFile, switchFile, handleCreating} = useContext(FileContext)

  return <div className="flex flex-row items-center text-sm select-none">
    {
      fileList.map(file => {
        const isActive = file.id === currentFileId
        const currentTabClasses = basicTabClasses + (isActive ? activeTabClasses : unActiveTabClasses)
        const currCloseIconClasses: string = (isActive ? 'visible' : 'invisible') + ' w-2 h-2 ml-4 opacity-50 hover:opacity-100 group-hover:visible w-2 h-2 cursor-pointer'

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

    <button className={'hover:cursor-pointer hover:opacity-100 cursor-pointer opacity-50'}>
      <Plus size={18} onClick={() => {
        handleCreating(true)
      }}/>
    </button>
  </div>
}

export default Files