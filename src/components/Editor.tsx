import {useEffect, useRef} from "react";
import Editor, {basicEditorAreaSize, EditorDataProps} from "../engine/editor";
import {StatusBar} from "./StatusBar/StatusBar.tsx";
import uid from "../utilities/Uid.ts";

interface EditorComponentProps {
  data?: EditorDataProps
}

export const EditorComponent: React.FC<EditorComponentProps> = ({data}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Editor>(null)

  useEffect(() => {
    if (divRef.current) {
      const container = divRef!.current

      if (data) {
        editorRef.current = new Editor({
          container,
          data
        })
      } else {
        const newUID = uid();

        editorRef.current = new Editor({
          container, data: {
            id: newUID,
            size: basicEditorAreaSize,
            modules: [],
          },
        });

        const dataBase: Omit<ModuleProps, 'id'> = {
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

        const data: ModuleProps[] = Array.from({length: 1}, (_, index) => {
          return {
            ...dataBase,
            x: (index + 1) * 10,
            y: (index + 1) * 20,
          }
        })

        const modules = editorRef.current.batchCreate(data)

        editorRef.current.batchAdd(
          modules,
          "add-modules"
        )
      }
    }
  }, []);


  return <div className={'flex flex-col w-full h-full overflow-hidden'}>
    <div ref={divRef}></div>
    <StatusBar/>
  </div>
};
