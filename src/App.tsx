import './components/comp.css'
import {useEffect} from "react";
import {EditorComponent} from "./components/Editor.tsx";
import {ModulePanel} from './components/ModulePanel.tsx';
import {PropertyPanel} from './components/PropertyPanel.tsx';
import "./i18n/config.ts";
import ShortcutListener from "./components/ShortcutListener.tsx";
import Header from "./components/header/Header.tsx";
import {useSelector} from "react-redux";
import {RootState} from "./redux/store.ts";
import CreateFile from "./components/createFile.tsx";

function App() {
  const {files} = useSelector((state: RootState) => state.files);

  useEffect(() => {

  }, []);

  return <div className={'w-full h-full flex flex-col'}>
    <ShortcutListener/>
    <Header/>

    <main className={'flex flex-row overflow-hidden'}>
      <ModulePanel/>

      <EditorComponent/>

      <PropertyPanel/>
    </main>
    {
      Object.values(files).length === 0 && <CreateFile/>
    }
  </div>
}

export default App
