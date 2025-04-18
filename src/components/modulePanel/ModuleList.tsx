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
  const {executeAction} = useContext(EditorContext)

  useEffect(() => {
    // if (editorRef.current) { }
  }, [])
  return (
    <div className={'flex flex-wrap space-x-2 space-y-2'}>
      {
        modules.map((module, index) => (
          <div className={'shrink-0 select-none cursor-pointer'}
               key={index}

               onClick={() => {
                 const props = module.props as ModuleProps
                 props.x = getRandomNumber(1000)
                 props.y = getRandomNumber(2000)
                 props.lineWidth = 1
                 props.lineColor = getRandomHexColor()
                 props.fillColor = getRandomHexColor()

                 if (props.type === 'rectangle') {
                   props.width = getRandomNumber(200)
                   props.height = getRandomNumber(200)
                 }

                 if (props.type === 'ellipse') {
                   props.r1 = getRandomNumber(200)
                   props.r1 = getRandomNumber(200)
                 }

                 executeAction('module-add', [props])
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

const getRandomHexColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
}

// @ts-ignore

const getRandomNumber = (max: number): number => {
  return Math.floor(Math.random() * max)
}