import {useContext, useEffect} from 'react'
import EditorContext from '../editorContext/EditorContext.tsx'

interface ModulePanelProps {

}

const modules: { className: string, props: Partial<ModuleProps> }[] = [
  {
    className: 'w-20 h-10',
    props: {
      type: 'rectangle',
      x: 200,
      y: 200,
      width: 100,
      height: 50,
    },
  }, {
    className: 'w-10 h-10 rounded-3xl',
    props: {
      type: 'ellipse',
      x: 200,
      y: 200,
      r1: 100,
      r2: 100,
    },
  },
]

export const ModuleList: React.FC<ModulePanelProps> = () => {
  const {editorRef, executeAction} = useContext(EditorContext)

  useEffect(() => {
    if (editorRef.current) { }
  }, [editorRef])
  return (
    <div className={'flex flex-wrap space-x-2 space-y-2'}>
      {
        modules.map((module, index) => (
          <div className={'shrink-0 select-none cursor-pointer'}
               key={index}

               onClick={() => {
                 executeAction('module-add', [module.props])
               }}
          >
            <div style={{
              border: '1px solid #dfdfdf',
            }} className={module.className}></div>
          </div>
        ))
      }
    </div>
  )
}