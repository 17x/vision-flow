import './components/comp.css'
import {useEffect} from "react";
import "./i18n/config.ts";
import {EditorProvider} from "./components/EditorContext.tsx";
import {useSelector} from "react-redux";
import {RootState} from "./redux/store.ts";
import CreateFile from "./components/createFile.tsx";

function App() {
  const {files} = useSelector((state: RootState) => state.files);

  useEffect(() => {

  }, []);

  return <>
    {
      Object.values(files).map((file) => {
        console.log(file)
        return <EditorProvider key={file.id}/>
      })
    }
    {
      Object.values(files).length === 0 && <CreateFile/>
    }
  </>
}

export default App
