import {useContext, useEffect, useRef} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'
import {EditorExecutor} from '../components/workspace/Workspace.tsx'
import SHORTCUTS_DATA from '../constants/actions.ts'
import Shortcut from '../lib/shortcut/shortcut.ts'
import matchObject from '../utilities/find.ts'
import deepClone from '../utilities/deepClone.ts'

const useShortcut = (executeAction: EditorExecutor) => {
  const {state: {focused}} = useContext(WorkspaceContext)
  const pluginRef = useRef<Shortcut | null>(null)

  useEffect(() => {
    if (!pluginRef.current) {
      const data = matchObject(deepClone(SHORTCUTS_DATA), (item) => !!item.shortcut) as {
        id: string,
        shortcut: string
      }[]

      pluginRef.current = new Shortcut({
        shortcuts: data,
        callback: (code) => {
          if (focused) {
            executeAction(code)
          }
        },
      })
    }

    return () => {
      pluginRef.current?.destroy()
      pluginRef.current = null
    }
  }, [focused])
}

export default useShortcut