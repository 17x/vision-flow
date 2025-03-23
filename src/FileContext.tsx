import {createContext, FC, ReactNode, useState} from "react";

interface EditorContextType {
  creating: boolean
}

export const FileContext = createContext<EditorContextType>({
  creating: false
});

const FileProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [creating, setCreating] = useState()

  return (
    <FileContext.Provider value={{
      creating,
      setCreating
    }}>
      {children}
    </FileContext.Provider>
  );
};

export default FileProvider;