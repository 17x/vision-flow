import {createContext} from 'react'
import {EditorExportFileType} from '../../engine/editor/type'

export interface FileType extends EditorExportFileType {
  name: string
  initialized?: boolean
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
  setFileInitialized: (id: UID) => void
  handleCreating: (v: boolean) => void
  saveFileToLocal: (v: EditorExportFileType) => void
  startCreateFile: VoidFunction
}

const FileContext = createContext<FileContextType>({
  fileMap: new Map(),
  fileList: [],
  currentFileId: '',
  creating: false,
  switchFile: () => {
  },
  closeFile: () => {
  },
  createFile: () => {
  },
  handleCreating: () => {
  },
  setFileInitialized: () => {
  },
  startCreateFile: () => {
  },
  saveFileToLocal: () => {
  },
})

export default FileContext