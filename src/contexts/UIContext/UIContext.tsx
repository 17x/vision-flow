import {createContext, useContext} from 'react'
import {DPR} from '@lite-u/editor/type.ts'

const UIContext = createContext<{ dpr: DPR }>({
  dpr: 2,
})

export const useUI = () => useContext(UIContext)

export default UIContext