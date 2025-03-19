import {ReactNode, useContext, useEffect, useState} from "react";
import {EditorContext} from "../EditorContext.tsx";
import {HistoryNode} from "../../engine/editor/history/HistoryDoublyLinkedList.ts";

/*interface HistoryPanelProps {
  // history: unknown[]
}*/

export const HistoryPanel: React.FC<{}> = () => {
  const {historyArray, historyCurrent, applyHistoryNode} = useContext(EditorContext);

  return (
    <div>
      <h1>History</h1>
      <div className={'flex flex-wrap space-x-2 space-y-2'}>
        {
          historyArray.map((historyNode, index) => {
              const isCurr = historyNode === historyCurrent

              return <div key={index}
                          onClick={() => {
                            if (isCurr) return

                            console.log('current', historyNode)
                            return applyHistoryNode(historyNode);

                          }}>
                {isCurr && <span>!</span>}
                <span>{historyNode.value.type}</span>
              </div>
            }
          )

        }

      </div>
    </div>
  );
};