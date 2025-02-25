import './App.css'
import {RendererComponent} from "./engine/renderer/Comp.tsx"

const MOCK_DATA1: JSONValue = [
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

const MOCK_DATA2: JSONValue = [
  {
    a: 5
  },
  {
    b: 6
  },
  {
    c0: [
      {
        c1: 7
      },
      {
        c2: 8
      },
    ]
  }
]

function App() {
  return (
    <div>
      <RendererComponent data={JSON.stringify(MOCK_DATA1)} />
      <RendererComponent data={JSON.stringify(MOCK_DATA2)} />
    </div>
  )
}

export default App
