import {FC, ReactNode, useEffect, useRef, useState} from "react";
import CreateFile from "../CreateFile.tsx";
import FileContext, {FileMap, FileType} from "./FileContext.tsx";

const FileProvider: FC<{ children: ReactNode }> = ({children}) => {
  const files = useRef<FileMap>(new Map())
  const [creating, setCreating] = useState<boolean>(false)
  const [currentFileId, setCurrentFileId] = useState<UID>('')

  const fileLen = files.current.size
  const showCreateFile = fileLen === 0 || creating

  console.log(fileLen, fileLen, creating)

  useEffect(() => {

  }, [])

  const switchFile = (id: UID) => {
    setCurrentFileId(id)
  }

  const closeFile = (id: UID) => {
    files.current.delete(id)
  }

  const createFile = (file: FileType) => {
    files.current.set(file.id, file)
    console.log(files)
  }

  const handleCreating = (v: boolean) => {
    setCreating(v)
  }

  return (
    <FileContext.Provider value={{
      files: files.current,
      creating,
      currentFileId,
      switchFile,
      closeFile,
      createFile,
      handleCreating,
    }}>
      <>
        {children}
        {showCreateFile && <CreateFile bg={fileLen ? '#00000080' : '#fff'}/>}
      </>
    </FileContext.Provider>
  );
};

export default FileProvider;