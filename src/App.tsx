import './components/comp.css'
import './i18n/config.ts'
import FileProvider from './components/fileContext/FileProvider.tsx'
import ThemeProvider from '@lite-u/ui/theme'

function App() {
  return <ThemeProvider>
    <FileProvider/>
  </ThemeProvider>
}

export default App
