import './components/comp.css'
import "./i18n/config.ts";
import FileProvider from "./components/fileContext/FileProvider.tsx";
import EditorProvider from "./components/editorContext/EditorProvider.tsx";
import MOCK_FILE from "./mock.ts";


function App() {
  return <FileProvider data={MOCK_FILE}>
    <EditorProvider/>
  </FileProvider>
}

export default App
