import {useEffect, useRef} from "react";
import Editor, {EditorDataProps} from "../engine/editor";
import {ModulePanel} from "./ModulePanel.tsx";
// import Toolbar from "./menu/Toolbar.tsx";
import {StatusBar} from "./StatusBar/StatusBar.tsx";
import {Menu} from "./menu/Menu.tsx";
import {PropertyPanel} from "./PropertyPanel.tsx";

interface EditorComponentProps {
  data?: EditorDataProps
}

export const EditorComponent: React.FC<EditorComponentProps> = ({data}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const dpr = window.devicePixelRatio
  // const screenResolution: Resolution = {width: window.outerWidth, height: window.outerHeight};
  // const physicalResolution: Resolution = {...screenResolution};
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

  return <div className={'w-full h-full flex flex-col'}>
    <Menu />

    <main className={'flex flex-row overflow-hidden'}>
      <ModulePanel />

      <div className={'flex flex-col w-full h-full overflow-hidden'}>
        <div ref={divRef}></div>
        <StatusBar />
      </div>

      <PropertyPanel />
    </main>

  </div>
};
