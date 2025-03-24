import './components/comp.css'
import "./i18n/config.ts";
import FileProvider from "./components/fileContext/FileContext.tsx";
import EditorProvider from "./components/editorContext/EditorContext.tsx";

function App() {
  return <FileProvider>
    <EditorProvider/>
  </FileProvider>
}

export default App
