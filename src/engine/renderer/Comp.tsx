import Renderer from "./index.tsx";
import {useEffect, useRef} from "react";

type RendererComponentProps = {}
const RendererComponent: FC.props<> = (props: RendererComponentProps) => {
  
  useEffect(() => {
    const render = Renderer()
  })

  return <div>
    <canvas ref={canvasRef}></canvas>
  </div>
}

export default Renderer
