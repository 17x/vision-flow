import {createContext, useContext} from 'react'
import {AssetsObj} from '@editor/engine/assetsManager/AssetsManager.ts'

type ElementProps = ModuleProps

export interface VisionWorkspace {
  id: string
  name: string
  elements: ElementProps[]
  config?: {}
  assets?: AssetsObj[]
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

interface FileContextType {
  fileMap: Map<UID, VisionFileType>
  fileList: VisionFileType[]
  creating: boolean
  focusedFileId: string | undefined
  focusOnFile: (id: UID) => void
  openFile: (file: VisionFileType) => void
  closeFile: (id: UID) => void
  createFile: (v: VisionFileType) => void
  handleCreating: (v: boolean) => void
  saveFileToLocal: (v: never) => void
  startCreateFile: VoidFunction
}

const dFile = {
  'id': '29455cb7-8406-4512-98f4-61d5e1d840ec',
  'name': 'A4',
  'version': '0.0.2',
  'createdAt': 1745561608440,
  'updatedAt': 1745561608440,
  'config': {
    'page': {
      'dpi': 72,
      'name': 'A4',
      'unit': 'mm',
      'width': 210,
      'height': 297,
    },
  },
  'workspace': [
    {
      'id': 'ile9lt',
      'name': 'workspace-1',
      'elements': [],
    },
  ],
}

const FileContext = createContext<FileContextType>({
  fileMap: new Map([[dFile.id, dFile]]),
  fileList: [dFile],
  // fileMap: new Map(),
  // fileList: [],
  focusedFileId: '',
  creating: false,
  focusOnFile: () => {
  },
  openFile: () => {
  },
  closeFile: () => {
  },
  createFile: () => {
  },
  handleCreating: () => {
  },
  startCreateFile: () => {
  },
  saveFileToLocal: () => {
  },
})

export const useFile = () => useContext(FileContext)

export default FileContext