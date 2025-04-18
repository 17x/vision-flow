import {FC, useEffect, useRef, useState} from 'react'
import CreateFile from '../CreateFile.tsx'
import FileContext, {FileMap, FileType} from './FileContext.tsx'
import EditorProvider from '../editorContext/EditorProvider.tsx'
// import MOCK_FILE_MAP from '../../mock.ts'
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
    readFileFromLocal()
  }, [])

  const setFileInitialized = (fileId: UID) => {
    fileMap.current.forEach(file => {
      if (file.id === fileId) {
        file.initialized = true
      }
    })

    updateFileList()
  }

  const updateFileList = (): FileType[] => {
    const arr = Array.from(fileMap.current.values())

    setFileList(arr)

    if (!currentFileId) {
      if (arr[0]) {
        switchFile(arr[0].id)
      }
    }

    return arr
  }

  const switchFile = (id: UID) => {
    // console.log(fileList)
    setCurrentFileId(id)
  }

  const closeFile = (deletingId: UID) => {
    const deletingFileIndex = fileList.findIndex(file => file.id === deletingId)
    let len = fileList.length

    if (deletingFileIndex === -1) return
    deleteFileFromLocal(deletingId)
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

  const deleteFileFromLocal = (id: UID) => {
    let item = localStorage.getItem(STORAGE_ID)
    let savedFileMap = JSON.parse(item!)
    const fileId = id

    if (savedFileMap && savedFileMap[fileId]) {
      delete savedFileMap[fileId]
    }

    localStorage.setItem(STORAGE_ID, JSON.stringify(savedFileMap))
    localStorage.removeItem(fileId)
    console.log('deleted')
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
    const fileId = file.id

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
      setFileInitialized,
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

        <div className={'flex-1 overflow-hidden min-h-[600px] relative'}>
          {
            fileList.map(file => <div key={file.id}
                                      data-file-id={file.id}
                                      className={'flex top-0 left-0 absolute outline-0 w-full h-full flex-col'}
                                      style={{
                                        zIndex: file.id === currentFileId ? 20 : 10,
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