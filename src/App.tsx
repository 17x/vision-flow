import './components/comp.css'
import {useEffect} from "react";
import {EditorComponent} from "./components/Editor.tsx";
import MenuBar from './components/menu/Menu.tsx';
import {ModulePanel} from './components/ModulePanel.tsx';
import {PropertyPanel} from './components/PropertyPanel.tsx';
import "./i18n/config.ts";
import ShortcutListener from "./components/ShortcutListener.tsx";

function App() {
  useEffect(() => {

  }, []);

  return <div className={'w-full h-full flex flex-col'}>
    <ShortcutListener/>
    <MenuBar/>

    <main className={'flex flex-row overflow-hidden'}>
      <ModulePanel/>

      <EditorComponent/>

      <PropertyPanel/>
    </main>

  </div>
}

export default App
