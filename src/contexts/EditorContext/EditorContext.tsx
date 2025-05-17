import {createContext} from 'react'
import {EditorExecutor} from '../../components/workspace/Workspace.tsx'

interface EditorContextType {
  run: EditorExecutor
}

const EditorContext = createContext<EditorContextType>({
  run: () => {},
})

export default EditorContext