import {useContext, useEffect, useRef} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'
import {EditorExecutor} from '../components/workspace/Workspace.tsx'
import SHORTCUTS_DATA from '../constants/actions.ts'
import Shortcut from '../lib/shortcut/shortcut.ts'
import matchObject from '../utilities/find.ts'

const useShortcut = (executeAction: EditorExecutor) => {
  const {state: {focused}} = useContext(WorkspaceContext)
  const pluginRef = useRef<Shortcut | null>(null)

  useEffect(() => {
    if (!pluginRef.current) {
      const data = []
      const a = matchObject(SHORTCUTS_DATA, (item) => {
        return !!item.shortcut
      })

      console.log(a)
      /*SHORTCUTS_DATA.forEach((data) => {
        // console.log(data)
      })*/
      pluginRef.current = new Shortcut({
        shortcuts: data,
        callback: (code) => {
          executeAction(code)
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