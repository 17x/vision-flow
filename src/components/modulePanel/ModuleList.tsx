import {useContext, useEffect} from 'react'
import EditorContext from '../../contexts/editorContext/EditorContext.tsx'

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
  }, {
    className: 'w-10 h-10',
    props: {
      type: 'text',
      x: 200,
      y: 200,
      width: 100,
      height: 50,
    },
  }, {
    className: 'w-10 h-10',
    props: {
      type: 'image',
      x: 200,
      y: 200,
      width: 100,
      height: 50,
      src: '',
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

                 if (props.type === 'rectangle') {
                   props.x = getRandomNumber(1000)
                   props.y = getRandomNumber(2000)
                   props.lineWidth = 1
                   props.lineColor = getRandomHexColor()
                   props.fillColor = getRandomHexColor()
                   props.width = getRandomNumber(200)
                   props.height = getRandomNumber(200)
                 }

                 if (props.type === 'ellipse') {
                   props.x = getRandomNumber(1000)
                   props.y = getRandomNumber(2000)
                   props.lineWidth = 1
                   props.lineColor = getRandomHexColor()
                   props.fillColor = getRandomHexColor()
                   props.r1 = getRandomNumber(200)
                   props.r1 = getRandomNumber(200)
                 }

                 if (props.type === 'text') {
                   props.x = 200
                   props.y = 200
                   props.lineWidth = 1
                   props.lineColor = 'transparent'
                   props.fillColor = 'transparent'
                   props.textColor = 'blue'
                   props.content = 'Hello Text'
                 }

                 if (props.type === 'image') {
                   props.x = 200
                   props.y = 200
                   props.lineWidth = 1
                   props.lineColor = 'transparent'
                   props.fillColor = 'transparent'
                   props.textColor = 'blue'
                   props.src = 'https://cdn.pixabay.com/photo/2018/08/04/11/30/draw-3583548_1280.png'
                 }

                 executeAction('module-add', [props])
               }}
          >
            <div
              className={'flex items-center justify-center border text-xs ' + module.className}>{module.props.type}</div>
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