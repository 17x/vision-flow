import React, {createContext, useEffect, useRef} from 'react';
import Editor, {basicEditorAreaSize} from "../engine/editor";
import ShortcutListener from "./ShortcutListener.tsx";
import Header from "./header/Header.tsx";
import {ModulePanel} from "./modulePanel/ModulePanel.tsx";
import {PropertyPanel} from "./PropertyPanel.tsx";
import {StatusBar} from "./StatusBar/StatusBar.tsx";
import uid from "../utilities/Uid.ts";

interface EditorContextType {
  editorRef: React.RefObject<Editor | null>
}

export const EditorContext = createContext<EditorContextType>({
  editorRef: {} as React.RefObject<Editor>
});


export const EditorProvider = () => {
  const editorRef = useRef<Editor>(null)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let editor: Editor;

    if (divRef.current) {
      const container = divRef!.current

      const newUID = uid();

      editor = new Editor({
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const data: ModuleProps[] = Array.from({length: 1}, (_, index) => {
        return {
          ...dataBase,
          x: (index + 1) * 10,
          y: (index + 1) * 20,
        }
      })

      const modules = editor.batchCreate(data)

      editor.batchAdd(
        modules,
        "add-modules"
      )

      editorRef.current = editor
    }


  }, [])

  return (
    <EditorContext.Provider value={{
      editorRef
    }}>
      <div className={'w-full h-full flex flex-col'}>
        <ShortcutListener/>
        <Header/>

        <main className={'flex flex-row overflow-hidden'}>
          <ModulePanel/>

          <div className={'flex flex-col w-full h-full overflow-hidden'}>
            <div ref={divRef}></div>
            <StatusBar/>
          </div>
          {/*<EditorComponent/>*/}

          <PropertyPanel/>
        </main>

      </div>
    </EditorContext.Provider>
  );
};