import './components/comp.css'
import './i18n/config.ts'
import FileProvider from './components/fileContext/FileProvider.tsx'
import UIProvider from './components/UIContext/UIProvider.tsx'
import ThemeProvider from '@lite-u/ui/theme'

function App() {
  return <ThemeProvider>
    <UIProvider>
      <FileProvider/>
    </UIProvider>
  </ThemeProvider>
}

export default App
