import {createContext, useContext} from 'react'
import {EditorExecutor} from '../../components/workspace/Workspace.tsx'

interface EditorContextType {
  run: EditorExecutor
}

const EditorContext = createContext<EditorContextType>({
  run: () => {},
})

export const useUI = () => useContext(EditorContext)

export default EditorContext