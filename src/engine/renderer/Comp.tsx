import Renderer, {RendererProps} from "./index";
import {useEffect, useRef} from "react";

/*export interface RendererComponentProps {
  data: string
  theme: ThemeShape
}*/

interface RendererComponentProps extends Omit<RendererProps, 'canvas'> {
  data: string
}

export const RendererComponent: React.FC<RendererComponentProps> = ({data, ...rest}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  console.log(rest)
  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new Renderer({canvas: canvasRef.current, ...rest});

      renderer.render(data)
    }
  }, [data, rest]);

  return (
    <div style={{boxShadow: '0px 0px 5px 0px #000'}}>
      <canvas ref={canvasRef}
              style={{
                width: rest.physicalResolution.width / 2,
                height: rest.physicalResolution.height / 2,
              }}></canvas>
    </div>
  );
};
