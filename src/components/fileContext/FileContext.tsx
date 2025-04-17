import {createContext} from 'react'

export interface FileType {
  id: UID
  name: string
  config: unknown
  data: unknown
}

export type FileMap = Map<string, FileType>;

interface FileContextType {
  fileMap: FileMap
  fileList: FileType[]
  creating: boolean
  currentFileId: string | undefined
  switchFile: (id: UID) => void
  closeFile: (id: UID) => void
  createFile: (v: FileType) => void
  handleCreating: (v: boolean) => void
  startCreateFile: VoidFunction
}

const FileContext = createContext<FileContextType>({
  fileMap: new Map([
    [
      'fbbeddd8-0996-4ebb-8c1e-9d1ea5312ebb',
      {
        'id': 'fbbeddd8-0996-4ebb-8c1e-9d1ea5312ebb',
        'name': 'Untitled 1',
        'config': {},
        'data': {},
      },
    ],
  ]),
  fileList: [],
  currentFileId: 'fbbeddd8-0996-4ebb-8c1e-9d1ea5312ebb',
  creating: false,
  switchFile: () => {
  },
  closeFile: () => {
  },
  createFile: () => {
  },
  handleCreating: () => {
  },
  startCreateFile: () => {
  },
})

export default FileContext