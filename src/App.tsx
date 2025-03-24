import './components/comp.css'
import "./i18n/config.ts";
import FileProvider from "./components/fileContext/FileProvider.tsx";
import EditorProvider from "./components/editorContext/EditorProvider.tsx";

function App() {

  return <FileProvider>
    <EditorProvider/>
  </FileProvider>
}

export default App
