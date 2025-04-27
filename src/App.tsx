import './components/comp.css'
import './i18n/config.ts'
import FileProvider from './contexts/fileContext/FileProvider.tsx'
import UIProvider from './contexts/UIContext/UIProvider.tsx'
import LiteUIProvider from '@lite-u/ui/LiteUIProvider'

function App() {
  return <LiteUIProvider>
    <UIProvider>
      <FileProvider/>
    </UIProvider>
  </LiteUIProvider>
}

export default App
