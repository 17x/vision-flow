import {FC, ReactNode, useEffect, useRef, useState} from "react";
import CreateFile from "../CreateFile.tsx";
import FileContext, {FileMap, FileType} from "./FileContext.tsx";

const FileProvider: FC<{ children: ReactNode, data: FileMap }> = ({children, data}) => {
  const files = useRef<FileMap>(new Map())
  const [creating, setCreating] = useState<boolean>(false)
  const [currentFileId, setCurrentFileId] = useState<UID>('')
  const [forceRenderCounter, setForceRenderCounter] = useState(0);
  const fileLen = files.current.size
  const showCreateFile = fileLen === 0 || creating

  useEffect(() => {
    console.log(data)
  }, [data]);

  const switchFile = (id: UID) => {
    setCurrentFileId(id)
  }

  const closeFile = (id: UID) => {
    files.current.delete(id)
    setForceRenderCounter(forceRenderCounter + 1)
  }

  const createFile = (file: FileType) => {
    files.current.set(file.id, file)
    setForceRenderCounter(forceRenderCounter + 1)
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