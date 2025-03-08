import {useEffect, useRef} from "react";
import Editor, {basicEditorAreaSize, EditorDataProps} from "../engine/editor";
import {ModulePanel} from "./ModulePanel.tsx";
// import Toolbar from "./menu/Toolbar.tsx";
import {StatusBar} from "./StatusBar/StatusBar.tsx";
import {Menu} from "./menu/Menu.tsx";
import {PropertyPanel} from "./PropertyPanel.tsx";
import uid from "../utilities/Uid.ts";
import generatorModuleByType from "../engine/editor/generator.ts";
import {RectangleProps} from "../engine/core/modules/shapes/rectangle.ts";

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
        })
      } else {
        const newUID = uid();

        editor = new Editor({
          container, data: {
            id: newUID,
            size: basicEditorAreaSize,
            modules: [],
          },
        });

        const dataBase: Omit<RectangleProps, 'id'> = {
          type: "rectangle",
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          lineColor: "000",
          fillColor: "000000",
          opacity: 100,
          shadow: false,
        }

        const data = Array.from({length: 1}, (_, index) => {
          return {
            ...dataBase,
            x: (index + 1) * 10,
            y: (index + 1) * 20,
          }
        })

        console.log(data)

        editor.addModules(
          data,
          "add-modules"
        )
      }
    }
  }, []);

  return <div className={'w-full h-full flex flex-col'}>
    <Menu/>

    <main className={'flex flex-row overflow-hidden'}>
      <ModulePanel/>

      <div className={'flex flex-col w-full h-full overflow-hidden'}>
        <div ref={divRef}></div>
        <StatusBar/>
      </div>

      <PropertyPanel/>
    </main>

  </div>
};
