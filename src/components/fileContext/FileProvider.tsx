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

      setCurrentFileId(updateFileList()[0].id)
    }
  }, []);

  const updateFileList = (): FileType[] => {
    const arr = Array.from(fileMap.current.values())

    setFileList(arr)

    return arr
  }

  const switchFile = (id: UID) => {
    setCurrentFileId(id)
  }

  const closeFile = (id: UID) => {
    fileMap.current.delete(id)
    updateFileList()
  }

  const createFile = (file: FileType) => {
    fileMap.current.set(file.id, file)
    updateFileList()
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
        <Files />
        {
          fileList.map(file =>
            <EditorProvider key={file.id} file={file}/>
          )
        }

        {showCreateFile && <CreateFile bg={fileLen ? '#00000080' : '#fff'}/>}
      </>
    </FileContext.Provider>
  );
};

export default FileProvider;