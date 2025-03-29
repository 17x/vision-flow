import defaultTheme from "./default.theme.ts"
import darkTheme from "./dark.theme.ts"
import minimalistTheme from './minimalist.theme.ts'
import monochromeTheme from './mono.theme.ts'
import neonTheme from './neon.theme.ts'
import retroTheme from './retro.theme.ts'

const themeMap: ThemeSpec = {
  'default': defaultTheme,
  'dark': darkTheme,
  'minimalist': minimalistTheme,
  'monochrome': monochromeTheme,
  'retro': retroTheme,
  'neon': neonTheme
}


export default themeMap