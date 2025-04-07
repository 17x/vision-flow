import {useContext, useEffect} from 'react'
import EditorContext from '../editorContext/EditorContext.tsx'

const PropPanel = () => {
  const {selectedProps} = useContext(EditorContext)

  // console.log(selectedProps)

  useEffect(() => {
    // console.log(9)
  }, [selectedProps])

  return <div className={'p-2'}>
    <h1 className={'bg-gray-400 text-white px-2'}><span>Properties</span></h1>
    <div className={'scrollbar-custom overflow-x-hidden overflow-y-auto p-2 border h-30 border-gray-200 select-none'}>
      {selectedProps && <ShapePropsPanel props={selectedProps}/>}
    </div>
  </div>
}

export default PropPanel

const ShapePropsPanel = ({props}: { props: ShapePropsType }) => {
  // const [props, setProps] = useState(initialProps)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    // const {name, type, value, checked} = e.target
    /* setProps((prev) => ({
       ...prev,
       [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
     }))*/
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
          <span>Radius:</span>
          <input
            type="number"
            name="radius"
            defaultValue={props.radius}
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
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span>Shadow</span>
          <input
            type="checkbox"
            name="shadow"
            defaultChecked={props.shadow}
            onChange={handleChange}
            className="ml-2"
          />
        </div>
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
        <div className="px-4 w-full h-full flex justify-between items-center">
          <span>Layer:</span>
          <input
            type="number"
            name="layer"
            defaultValue={props.layer}
            onChange={handleChange}
            className="w-16 px-2 py-1 text-black rounded"
          />
        </div>
      </div>
    </div>
  )
}