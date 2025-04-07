import {FC, useEffect, useRef, useState} from "react"
import CreateFile from "../CreateFile.tsx"
import FileContext, {FileMap, FileType} from "./FileContext.tsx"
import EditorProvider from "../editorContext/EditorProvider.tsx"
import MOCK_FILE_MAP from "../../mock.ts"
import Files from "../files/Files.tsx"
import LanguageSwitcher from "../language/languageSwitcher.tsx"

const FileProvider: FC = () => {
  const fileMap = useRef<FileMap>(new Map())
  const [creating, setCreating] = useState<boolean>(false)
  const [currentFileId, setCurrentFileId] = useState<UID>('')
  const [fileList, setFileList] = useState<FileType[]>([])
  const fileLen = fileMap.current.size
  const showCreateFile = fileLen === 0 || creating

  useEffect(() => {
    if (MOCK_FILE_MAP.size > 0) {
      fileMap.current = MOCK_FILE_MAP
      updateFileList()

      setCurrentFileId(listFileMap()[0].id)
    }
  }, [])

  const updateFileList = (): FileType[] => {
    const arr = listFileMap()

    setFileList(arr)

    return arr
  }

  const listFileMap = () => Array.from(fileMap.current.values())

  const switchFile = (id: UID) => {
    setCurrentFileId(id)
  }

  const closeFile = (deletingId: UID) => {
    const deletingFileIndex = fileList.findIndex(file => file.id === deletingId)
    let len = fileList.length

    if (deletingFileIndex === -1) return

    fileMap.current.delete(deletingId)
    updateFileList()
    fileList.splice(deletingFileIndex, 1)
    len--

    if (currentFileId === deletingId && len > 0) {
      let newOpenFileIndex: number = deletingFileIndex + 1

      if (deletingFileIndex === 0) {
        newOpenFileIndex = 0
      }
      if (newOpenFileIndex > len) {
        newOpenFileIndex = len - 1
      }

      setCurrentFileId(fileList[newOpenFileIndex].id)
    }

  }

  const createFile = (file: FileType) => {
    fileMap.current.set(file.id, file)
    updateFileList()
    setCurrentFileId(file.id)
  }

  const handleCreating = (v: boolean) => {
    setCreating(v)
  }

  return (
    <FileContext.Provider value={{
      fileMap: fileMap.current,
      fileList,
      creating,
      currentFileId,
      switchFile,
      closeFile,
      createFile,
      handleCreating,
    }}>
      <div className={'w-full h-full flex flex-col'}>
        <div className={'flex justify-between'}>
          <Files/>
         <LanguageSwitcher />
        </div>
        
        <div className={'flex-1 overflow-hidden min-h-[600px]'}>
          {
            fileList.map(file =>
              file.id === currentFileId ?
                <EditorProvider key={file.id} file={file}/>
                : undefined
            )
          }
        </div>

        {
          showCreateFile &&
            <CreateFile bg={fileLen ? '#00000080' : '#fff'}
                        onBgClick={() => {
                          if (fileLen) {
                            setCreating(false)
                          }
                        }
                        }/>
        }
      </div>
    </FileContext.Provider>
  )
}

export default FileProvider