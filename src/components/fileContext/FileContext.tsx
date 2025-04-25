import {createContext} from 'react'
import {EditorExportFileType} from '@editor/editor/type'

export interface FileType extends EditorExportFileType {
  name: string
  initialized?: boolean
}

type Element = ModuleInstance

export interface VisionSheet {
  name: string
  data: Element[]
  config?: {}
}

export interface VisionFilePageSet {
  unit: string
  width: number
  height: number
  dpi: number
}

export interface VisionFileType {
  id: string;
  name: string;
  version: string;
  createdAt: number;
  updatedAt: number;
  config: {
    page: {};
    editor?: {}
  };
  sheets: VisionSheet[];
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