import {FC, ReactNode} from 'react'
import EditorContext, {useUI} from './EditorContext.tsx'

const EditorProvider: FC<{ children: ReactNode }> = ({children}) => {

  return <EditorContext.Provider value={{
   }}>
    {children}
  </EditorContext.Provider>
}

export default EditorProvider