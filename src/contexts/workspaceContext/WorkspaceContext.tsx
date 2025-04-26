import {createContext, useContext} from 'react'
import {VisionWorkspace} from '../fileContext/FileContext.tsx'
import {Unit} from '@editor/type.ts'

interface WorkspaceContextType {
  workspaceList: VisionWorkspace[]
  pageConfig: {
    dpi: number
    width: number,
    height: number,
    unit: Unit,
  }
  creating: boolean
  focused: UID
  focusOn: (id: UID) => void
  close: (id: UID) => void
  executeAction: () => void
  saveFile: () => void
  create: (v: UID, data?: VisionWorkspace) => void
  handleCreating: (v: boolean) => void
  startCreateFile: VoidFunction
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaceList: [],
  pageConfig: {
    dpi: 2,
    width: 1,
    height: 1,
    unit: Unit.PX,
  },
  creating: false,
  focused: '',
  saveFile: () => {},
  focusOn: () => {},
  close: () => {},
  create: () => {},
  handleCreating: () => {},
  executeAction:()=>{},
  startCreateFile: () => {
  },
})

export const useWorkspace = () => useContext(WorkspaceContext)

export default WorkspaceContext