import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const MOCK_DATA:JSON = [
  {
    a: 1
  },
  {
    b: 2
  },
  {
    c0: [
      {
        c1: 3
      },
      {
        c2: 4
      },
    ]
  }
]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

  </StrictMode>,
)
