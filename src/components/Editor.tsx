import {useEffect, useRef} from "react";
import Editor, {EditorDataProps} from "../engine/editor";
import {Sidebar} from "./Sidebar.tsx";
import Toolbar from "./toolbar/Toolbar.tsx";

interface EditorComponentProps {
  data?: EditorDataProps
}

export const EditorComponent: React.FC<EditorComponentProps> = ({data}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const dpr = window.devicePixelRatio
  const screenResolution: Resolution = {width: window.outerWidth, height: window.outerHeight};
  const physicalResolution: Resolution = {...screenResolution};
  // const logicResolution: Resolution = {width: physicalResolution.width * dpr, height: physicalResolution.height * dpr};

  useEffect(() => {
    if (divRef.current) {
      const container = divRef!.current
      let editor: Editor

      if (data) {
        editor = new Editor({
          container,
          data,
          // logicResolution,
          // physicalResolution,
          // dpr,
          // zoom: 1,
        })
      } else {
        editor = Editor.createInstance(container)
      }

      // console.log(editor)
    }
  }, []);

  return <div>
    <Toolbar />
    <div style={{display: "flex", flexDirection: "row", alignItems: "center", height: "100%"}}>
      <Sidebar style={{flex: 1}} open />

      <div ref={divRef} style={{
        boxShadow: '0px 0px 5px 0px #000',
        width: physicalResolution.width / 2,
        height: physicalResolution.height / 2,
      }}></div>
    </div>
  </div>

};
