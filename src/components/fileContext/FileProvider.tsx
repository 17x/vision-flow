import {FC, useEffect, useRef, useState} from 'react'
import CreateFile from '../CreateFile.tsx'
import FileContext, {FileMap, FileType} from './FileContext.tsx'
import EditorProvider from '../editorContext/EditorProvider.tsx'
import MOCK_FILE_MAP from '../../mock.ts'
import Files from '../files/Files.tsx'
import LanguageSwitcher from '../language/languageSwitcher.tsx'
import {EditorExportFileType} from '../../engine/editor/type'

const FileProvider: FC = () => {
  const fileMap = useRef<FileMap>(new Map())
  const [creating, setCreating] = useState<boolean>(false)
  const [currentFileId, setCurrentFileId] = useState<UID>('')
  const [fileList, setFileList] = useState<FileType[]>([])
  const fileLen = fileMap.current.size
  const showCreateFile = fileLen === 0 || creating
  const STORAGE_ID = 'VISION_FLOW_FILE_MAP'
  const FILE_ID_PREFIX = 'VISION_FLOW_FILE_'

  useEffect(() => {
    /*  if (MOCK_FILE_MAP.size > 0) {
        fileMap.current = MOCK_FILE_MAP
        updateFileList()

        setCurrentFileId(listFileMap()[0].id)
      }*/

    readFileFromLocal()
  }, [])

  const updateFileList = (): FileType[] => {
    const arr = listFileMap()

    setFileList(arr)

    if (!currentFileId) {
      if (arr[0]) {
        switchFile(arr[0].id)
      }
    }
    return arr
  }

  const listFileMap = () => Array.from(fileMap.current.values())

  const switchFile = (id: UID) => {
    // console.log(fileList)
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

  const startCreateFile = () => {
    setCreating(true)
  }

  const handleCreating = (v: boolean) => {
    setCreating(v)
  }

  const saveFileToLocal = (file: EditorExportFileType) => {
    let item = localStorage.getItem(STORAGE_ID)
    let savedFileMap = JSON.parse(item!)
    const fileId = FILE_ID_PREFIX + file.id

    if (!savedFileMap) {
      savedFileMap = {}
    }
    console.log(file)
    savedFileMap[file.id] = fileId
    localStorage.setItem(STORAGE_ID, JSON.stringify(savedFileMap))
    localStorage.setItem(fileId, JSON.stringify(file))
    console.log('saved')
  }

  const readFileFromLocal = () => {
    let item = localStorage.getItem(STORAGE_ID)
    let savedFileMap = JSON.parse(item!)

    if (savedFileMap) {
      // console.log(savedFileMap)
      Object.values(savedFileMap).forEach((fileStorageKey) => {
        const fileRawData = localStorage.getItem(fileStorageKey as string)
        const fileData = JSON.parse(fileRawData!)

      console.log(fileData)
        fileMap.current.set(fileData.id, fileData)
      })
    }

    updateFileList()
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
      startCreateFile,
      saveFileToLocal,
      handleCreating,
    }}>
      <div className={'w-full h-full flex flex-col select-none'}>
        <div className={'flex justify-between'}>
          <Files/>
          <LanguageSwitcher/>
        </div>

        <div className={'flex-1 overflow-hidden min-h-[600px]'}>
          {
            fileList.map(file => <div key={file.id}
                                      className={'outline-0 w-full h-full flex flex-col'}
                                      style={{
                                        display: file.id === currentFileId ? 'flex' : 'none',
                                      }}>
              <EditorProvider file={file}/>
            </div>)
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