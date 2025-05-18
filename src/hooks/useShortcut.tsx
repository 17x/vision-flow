import {useContext, useEffect, useMemo, useRef} from 'react'
import {EditorExecutor} from '../components/workspace/Workspace.tsx'
import SHORTCUTS_DATA from '../constants/actions.ts'
import Shortcut from '../lib/shortcut/shortcut.ts'
import matchObject from '../utilities/find.ts'
import deepClone from '../utilities/deepClone.ts'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

const useShortcut = (executeAction: EditorExecutor) => {
  const {state: {currentTool, focused}} = useContext(WorkspaceContext)
  const lastToolRef = useRef<string>(null)
  const data = useMemo(() => {
    let arr = matchObject(deepClone(SHORTCUTS_DATA), (item) => !!item.shortcut) as {
      id: string,
      shortcut: string
    }[]

    arr.push({id: 'toggleTool', shortcut: 'space'})
    return arr
  }, [])

  useEffect(() => {
    const shortcut1 = new Shortcut({
      shortcuts: data,
      callback: (id: string) => {
        if (focused) {
          if (id === 'toggleTool' && lastToolRef.current !== currentTool) {
            lastToolRef.current = currentTool
            executeAction('switch-tool', 'panning')
            return
          }

          const c = data.find(item => item.id === id)
          if (c.editorAction) {
            executeAction(c.editorAction)
          }
        }
      },
    })

    const shortcut2 = new Shortcut({
      shortcuts: [{id: 'toggleTool', shortcut: 'space'}],
      upMode: true,
      callback: () => {
        if (lastToolRef.current) {
          executeAction('switch-tool', lastToolRef.current)
        }

        lastToolRef.current = null
      },
    })
    console.log(100)

    return () => {
      console.log(101)
      shortcut1.destroy()
      shortcut2.destroy()
      // pluginRef.current?.destroy()
      // pluginRef.current = null
    }
  }, [focused])
}

export default useShortcut