import {useContext, useEffect} from "react";
import {EditorContext} from "../EditorContext.tsx";

export const LayerPanel = () => {
  const {historyArray, historyCurrent} = useContext(EditorContext);

  useEffect(() => {

  }, [historyArray, historyCurrent]);

  return (
    <div>layers</div>
  );
};