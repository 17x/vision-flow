import {createContext, useContext} from 'react'
import {EditorExportFileType} from '@editor/editor/type'

export interface FileType extends EditorExportFileType {
  name: string
  initialized?: boolean
}

type Element = ModuleInstance

export interface VisionWorkspace {
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
    page: VisionFilePageSet;
    editor?: {}
  };
  workspace: VisionWorkspace[];
}

export type FileMap = Map<string, FileType>;

interface FileContextType {
  fileMap: FileMap
  fileList: FileType[]
  creating: boolean
  focusedFileId: string | undefined
  focusOnFile: (id: UID) => void
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
  focusedFileId: '',
  creating: false,
  focusOnFile: () => {
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

export const useFile = () => useContext(FileContext)

export default FileContext