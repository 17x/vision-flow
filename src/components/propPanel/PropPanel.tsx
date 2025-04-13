import {useContext, useEffect, useState} from 'react'
import EditorContext from '../editorContext/EditorContext.tsx'

// import EditorContext from '../editorContext/EditorContext.tsx'

interface PropPanelProps {props?: ModuleProps}

const PropPanel = ({props}: PropPanelProps) => {
  const [localProps, setLocalProps] = useState(props)
  console.log(props, localProps)
  useEffect(() => {
    if (props) {
      console.log(props)
      if (!localProps || localProps.id !== props.id) {
        setLocalProps({...props})
      }
    }
  }, [props])

  return <div className={'p-2'}>
    <h1 className={'bg-gray-400 text-white px-2'}><span>Properties</span></h1>
    <div className={'scrollbar-custom overflow-x-hidden overflow-y-auto p-2 border h-30 border-gray-200 select-none'}>
      { localProps && <ShapePropsPanel props={localProps}/>}
    </div>
  </div>
}

export default PropPanel

const ShapePropsPanel = ({props}: { props: ShapePropsType }) => {
  const {executeAction} = useContext(EditorContext)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyName = e.target.name
    const oldValue = props[keyName]
    let newValue: string | number = e.target.value

    if (keyName === 'x' || keyName === 'y' || keyName === 'width' || keyName === 'height') {
      newValue = Number(newValue)
    }
    console.log(keyName, newValue)

    executeAction('module-modify', [{
      id: props.id,
      props: {
        [keyName]: {
          from: oldValue,
          to: newValue,
        },
      },
    }])
  }

  return (
    <div className="z-30 text-sm">
      {/* Shape Properties Group */}
      <div className="mb-4 ">
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span className={''}>X:</span>
          <input
            type="number"
            name="x"
            defaultValue={props.x}
            onChange={handleChange}
            className="w-16 px-2 py-1 text-black rounded"
          />
        </div>
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span className={''}>Y:</span>
          <input
            type="number"
            name="y"
            defaultValue={props.y}
            onChange={handleChange}
            className="w-16 px-2 py-1 text-black rounded"
          />
        </div>
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span className={''}>Width:</span>
          <input
            type="number"
            name="width"
            defaultValue={props.width}
            onChange={handleChange}
            className="w-16 px-2 py-1 text-black rounded"
          />
        </div>
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span>Height:</span>
          <input
            type="number"
            name="height"
            defaultValue={props.height}
            onChange={handleChange}
            className="w-16 px-2 py-1 text-black rounded"
          />
        </div>
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span>Rotation:</span>
          <input
            type="number"
            name="rotation"
            defaultValue={props.rotation}
            onChange={handleChange}
            className="w-16 px-2 py-1 text-black rounded"
          />
        </div>
      </div>

      {/* Fill and Line Properties Group */}
      <div className="mb-4">
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span>Enable Fill</span>
          <input
            type="checkbox"
            name="enableFill"
            defaultChecked={props.enableFill}
            onChange={handleChange}
            className="ml-2"
          />
        </div>
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span>Fill Color:</span>
          <input
            type="color"
            name="fillColor"
            defaultValue={props.fillColor}
            onChange={handleChange}
            className="w-10 h-10 p-1 rounded"
          />
        </div>
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span>Enable Line</span>
          <input
            type="checkbox"
            name="enableLine"
            defaultChecked={props.enableLine}
            onChange={handleChange}
            className="ml-2"
          />
        </div>
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span>Line Color:</span>
          <input
            type="color"
            name="lineColor"
            defaultValue={props.lineColor}
            onChange={handleChange}
            className="w-10 h-10 p-1 rounded"
          />
        </div>
      </div>

      {/* Appearance Group */}
      <div className="mb-4">
        {/*<div className="px-4 w-full h-full flex justify-between items-center">
          <span>Shadow</span>
          <input
            type="checkbox"
            name="shadow"
            defaultChecked={props.shadow}
            onChange={handleChange}
            className="ml-2"
          />
        </div>*/}
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span>Opacity:</span>
          <input
            type="number"
            name="opacity"
            defaultValue={props.opacity}
            onChange={handleChange}
            className="w-16 px-2 py-1 text-black rounded"
          />
        </div>
      </div>
    </div>
  )
}