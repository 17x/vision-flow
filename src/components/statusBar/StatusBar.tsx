import ZoomSelect from "./zoom"
import {useContext} from "react"
import EditorContext from "../editorContext/EditorContext.tsx"

interface StatusBarProps {
  className?: string
}

export const StatusBar: React.FC<StatusBarProps> = ({className = ''}) => {
  const {viewport, executeAction} = useContext(EditorContext)
  // console.log(viewport)
  if (!viewport) return null

  return (
    <footer className={className + 'w-full h-8 flex justify-between pr-1 items-center border-t border-gray-200'}>
      {
        viewport &&
          <>
              <ZoomSelect key={viewport.scale} scale={viewport.scale} onChange={(newScale) => {
                executeAction('zoom', newScale as never)
              }}/>
              <div className={'text-xs line-clamp-1'}>{`dx:${viewport.dx.toFixed(2)} dx:${viewport.dy.toFixed(2)}`}</div>
          </>
      }
    </footer>
  )
}