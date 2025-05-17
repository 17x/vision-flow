import {FC, ReactNode} from 'react'
import EditorContext, {useUI} from './EditorContext.tsx'

const EditorProvider: FC<{ children: ReactNode }> = ({children}) => {
  const {dpr} = useUI()

  return <EditorContext.Provider value={{
    dpr,
  }}>
    {children}
  </EditorContext.Provider>
}

export default EditorProvider