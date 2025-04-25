import {createContext, useContext} from 'react'
import {VisionWorkspace} from '../fileContext/FileContext.tsx'

interface WorkspaceContextType {
  workspaceList: VisionWorkspace[]
  creating: boolean
  focused: UID
  focusOn: (id: UID) => void
  close: (id: UID) => void
  create: (v: UID, data?: VisionWorkspace) => void
  handleCreating: (v: boolean) => void
  startCreateFile: VoidFunction
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaceList: [],
  creating: false,
  focused: '',
  focusOn: () => {},
  close: () => {},
  create: () => {},
  handleCreating: () => {},
  startCreateFile: () => {
  },
})

export const useWorkspace = () => useContext(WorkspaceContext)

export default WorkspaceContext