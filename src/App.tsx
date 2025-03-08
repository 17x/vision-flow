import './components/comp.css'
import {useEffect} from "react";
import themeMap from "./theme";
import {EditorComponent} from "./components/Editor.tsx";
// import PanableVirtualScrollCanvas from "./components/VS.tsx";

/*
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
]*/


function App() {
  // const [currentTheme, setCurrentTheme] = useState<ThemeShape>();
  // const keyList = useMemo<ThemeSpecKey[]>(() => Object.keys(themeMap), []);

  useEffect(() => {
    // setCurrentTheme(themeMap[keyList[0]])
  }, [themeMap])

  // return <PanableVirtualScrollCanvas />
  return <EditorComponent />

  /*    <>
        <ThemeSelect list={keyList} onChange={(themeKey) => {
          setCurrentTheme(themeMap[themeKey])
        }} />
        <EditorComponent />
      </>*/

}

export default App
