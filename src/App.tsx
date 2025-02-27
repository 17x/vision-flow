import './App.css'
import {RendererComponent} from "./engine/renderer/Comp.tsx"
import {ThemeSelect} from "./theme/Comp.tsx";
import {useEffect, useMemo, useState} from "react";
import themeMap from "./theme";

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
        c2: 4,
        c3: 5,
        c4: 6,
      },
    ]
  }
]

/*const MOCK_DATA2: JSONValue = [
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
]*/

function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeShape>();
  const keyList = useMemo<ThemeSpecKey[]>(() => Object.keys(themeMap), []);
  const physicalResolution: Resolution = {width: window.outerWidth, height: window.outerHeight};
  const LogicResolution: Resolution = {width: window.outerWidth, height: window.outerHeight};

  useEffect(() => {
    setCurrentTheme(themeMap[keyList[0]])
  }, [themeMap])

  return (
    <div>
      <ThemeSelect list={keyList} onChange={(themeKey) => {
        setCurrentTheme(themeMap[themeKey])
      }} />
      {
        currentTheme &&
        <RendererComponent data={JSON.stringify(MOCK_DATA1)}
                           theme={currentTheme as ThemeShape}
                           physicalResolution={physicalResolution}
                           logicResolution={LogicResolution}
        />}
    </div>
  )
}

export default App
