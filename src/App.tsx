import './components/comp.css'
import {useEffect} from "react";
import {EditorComponent} from "./components/Editor.tsx";
import MenuBar from './components/menu/Menu.tsx';
import {ModulePanel} from './components/ModulePanel.tsx';
import {PropertyPanel} from './components/PropertyPanel.tsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import i18n from "./i18n";
import ShortcutListener from "./components/ShortcutListener.tsx";

function App() {
  useEffect(() => {

  }, [])

  return <div className={'w-full h-full flex flex-col'}>
    <ShortcutListener />
    <MenuBar/>

    <main className={'flex flex-row overflow-hidden'}>
      <ModulePanel/>

      <EditorComponent/>

      <PropertyPanel/>
    </main>

  </div>
}

export default App
