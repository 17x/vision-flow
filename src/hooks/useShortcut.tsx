import {useContext, useEffect, useRef} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'
import {EditorExecutor} from '../components/workspace/Workspace.tsx'
import SHORTCUTS_DATA from '../constants/shortcuts.ts'
import Shortcut from '../lib/shortcut/shortcut.ts'

const useShortcut = (executeAction: EditorExecutor) => {
  const {state: {focused}} = useContext(WorkspaceContext)
  const pluginRef = useRef<Shortcut | null>(null)

  useEffect(() => {
    if (!pluginRef.current) {
      pluginRef.current = new Shortcut({
        shortcuts: SHORTCUTS_DATA,
        callback: (code) => {
          console.log(focused)
          console.log(code)
        },
      })
    }

    return () => {
      pluginRef.current?.destroy()
      pluginRef.current = null
    }
  }, [])
}

export default useShortcut