import uid from "./utilities/Uid.ts";
import {FileMap, FileType} from "./components/fileContext/FileContext.tsx";

const CreateModules = (fileId: UID) => {
  const moduleList = []


  return moduleList
}

const CreateFile = (): FileType => {
  const defaultFileName = 'Untitled 1';
  const defaultConfig = {}
  const defaultData = {
    modules: CreateModules()
  }
  const id = uid()

  return {
    id,
    name: defaultFileName,
    config: defaultConfig,
    data: defaultData
  }
}

const CreateFileMapByFilesId = (files: FileType[]): FileMap => {
  return new Map(
    files.reduce<[UID, FileType][]>((acc, curr) => {
      acc.push([curr.id, curr])

      return acc
    }, [])
  );
}

const MOCK_FILE = CreateFile()
const fileMap = CreateFileMapByFilesId([MOCK_FILE])

export default fileMap