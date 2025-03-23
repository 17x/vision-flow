import './components/comp.css'
import "./i18n/config.ts";
import {EditorProvider} from "./components/EditorContext.tsx";

function App() {
  return <>
    <EditorProvider/>
  </>
}

export default App
