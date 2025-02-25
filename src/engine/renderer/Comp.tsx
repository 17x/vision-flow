import Renderer from "./index";
import {useEffect, useRef} from "react";

export const RendererComponent: React.FC<{ data: string }> = ({data}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new Renderer({canvas: canvasRef.current});

      renderer.render(data)
      // console.log(renderer)
    }
  }, [data]);

  return (
    <div style={{boxShadow: '0px 0px 5px 0px #000'}}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
