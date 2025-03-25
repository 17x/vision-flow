import {FC, useEffect, useRef, useState} from "react";
import CreateFile from "../CreateFile.tsx";
import FileContext, {FileMap, FileType} from "./FileContext.tsx";
import EditorProvider from "../editorContext/EditorProvider.tsx";
import MOCK_FILE_MAP from "../../mock.ts";
import Files from "../files/Files.tsx";

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
  }, []);

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

    fileMap.current.delete(deletingId)

    if (currentFileId === deletingId) {
      let newFileIndex: number = 0

      // If the deleting file is last one
      if (deletingFileIndex === 0) {
        newFileIndex = 0
      } else {
        newFileIndex = deletingFileIndex - 1
      }

      setCurrentFileId(fileList[newFileIndex].id)
    }
    updateFileList()
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
      <>
        <Files/>
        {
          fileList.map(file =>
            file.id === currentFileId ?
              <EditorProvider key={file.id} file={file}/>
              : undefined
          )
        }

        {showCreateFile && <CreateFile bg={fileLen ? '#00000080' : '#fff'}/>}
      </>
    </FileContext.Provider>
  );
};

export default FileProvider;