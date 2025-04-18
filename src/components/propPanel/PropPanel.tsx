import {memo, useContext, useEffect, useState} from 'react'
import EditorContext from '../editorContext/EditorContext.tsx'
import {ProtectedInput} from './protectedInput.tsx'

// import EditorContext from '../editorContext/EditorContext.tsx'

interface PropPanelProps {props?: ModuleProps}

const PropPanel = ({props}: PropPanelProps) => {
  const [localProps, setLocalProps] = useState(props)

  useEffect(() => {
    setLocalProps(props)
  }, [props])
  return <div className={'p-2'}>
    <h1 className={'bg-gray-400 text-white px-2'}><span>Properties</span></h1>
    <div className={'scrollbar-custom overflow-x-hidden overflow-y-auto p-2 border h-30 border-gray-200 select-none'}>
      {localProps && <ShapePropsPanel props={localProps}/>}
    </div>
  </div>
}

export default PropPanel

const ShapePropsPanel = ({props}: { props: ModuleProps }) => {
  const {executeAction} = useContext(EditorContext)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyName = e.target.name as keyof ModuleProps
    let newValue: string | number = e.target.value

    if ([
      'x',
      'y',
      'width',
      'height',
    ].includes(keyName)) {
      newValue = Number(newValue)
    }

    executeAction('module-modify', [{
      id: props.id,
      props: {
        [keyName]: newValue,
      },
    }])

    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className="z-30 text-sm"

    >
      {/* Shape Properties Group */}
      <div className="mb-1 ">
        <div className=" w-full h-full flex justify-between items-center">
          <span className={''}>X:</span>
          <ProtectedInput
            type="number"
            name="x"
            value={props.x}
            onChange={handleChange}
            className="w-16  py-1 text-black rounded"
          />
        </div>
        <div className=" w-full h-full flex justify-between items-center">
          <span className={''}>Y:</span>
          <ProtectedInput
            type="number"
            name="y"
            value={props.y}
            onChange={handleChange}
            className="w-16  py-1 text-black rounded"
          />
        </div>
        {
          props.type === 'ellipse' && <>
                <div className=" w-full h-full flex justify-between items-center">
                    <span className={''}>r1:</span>
                    <ProtectedInput
                        type="number"
                        name="r1"
                        value={props.r1}
                        onChange={handleChange}
                        className="w-16  py-1 text-black rounded"
                    />
                </div>
                <div className=" w-full h-full flex justify-between items-center">
                    <span>r2:</span>
                    <ProtectedInput
                        type="number"
                        name="r2"
                        value={props.r2}
                        onChange={handleChange}
                        className="w-16  py-1 text-black rounded"
                    />
                </div>
            </>
        }
        <div className=" w-full h-full flex justify-between items-center">
          <span className={''}>Width:</span>
          <ProtectedInput
            type="number"
            name="width"
            value={props.width}
            onChange={handleChange}
            className="w-16  py-1 text-black rounded"
          />
        </div>
        <div className=" w-full h-full flex justify-between items-center">
          <span>Height:</span>
          <ProtectedInput
            type="number"
            name="height"
            value={props.height}
            onChange={handleChange}
            className="w-16  py-1 text-black rounded"
          />
        </div>
        <div className=" w-full h-full flex justify-between items-center">
          <span>Rotation:</span>
          <ProtectedInput
            type="number"
            name="rotation"
            value={props.rotation}
            onChange={handleChange}
            className="w-16  py-1 text-black rounded"
          />
        </div>
      </div>

      {/* Fill and Line Properties Group */}
      <div className="mb-1">
        <div className=" w-full h-full flex justify-between items-center">
          <span>Enable Fill</span>
          <ProtectedInput
            type="checkbox"
            name="enableFill"
            value={props.enableFill}
            onChange={handleChange}
            className="ml-2"
          />
        </div>
        <div className=" w-full h-full flex justify-between items-center">
          <span>Fill Color:</span>
          <ProtectedInput
            type="color"
            name="fillColor"
            value={props.fillColor}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              console.log(e)
            }}
            onChange={handleChange}
            className="w-10 h-10 p-1 rounded"
          />
        </div>
        <div className=" w-full h-full flex justify-between items-center">
          <span>Enable Line</span>
          <ProtectedInput
            type="checkbox"
            name="enableLine"
            defaultChecked={props.enableLine}
            onChange={handleChange}
            className="ml-2"
          />
        </div>
        <div className=" w-full h-full flex justify-between items-center">
          <span>Line Color:</span>
          <ProtectedInput
            type="color"
            name="lineColor"
            value={props.lineColor}
            onChange={handleChange}
            className="w-10 h-10 p-1 rounded"
          />
        </div>
        <div className=" w-full h-full flex justify-between items-center">
          <span className={''}>Line Width:</span>
          <ProtectedInput
            type="number"
            name="lineWidth"
            value={props.lineWidth}
            onChange={handleChange}
            className="w-16  py-1 text-black rounded"
          />
        </div>
      </div>

      {/* Appearance Group */}
      <div className="mb-1">
        {/*<div className=" w-full h-full flex justify-between items-center">
          <span>Shadow</span>
          <ProtectedInput
            type="checkbox"
            name="shadow"
            defaultChecked={props.shadow}
            onChange={handleChange}
            className="ml-2"
          />
        </div>*/}
        <div className=" w-full h-full flex justify-between items-center">
          <span>Opacity:</span>
          <ProtectedInput
            type="number"
            name="opacity"
            value={props.opacity}
            onChange={handleChange}
            className="w-16  py-1 text-black rounded"
          />
        </div>
      </div>
    </div>
  )
}