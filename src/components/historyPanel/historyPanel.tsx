import {useContext, useEffect, useRef} from "react";
import {EditorContext} from "../EditorContext.tsx";
import {useTranslation} from "react-i18next";
import {I18nHistoryDataItem} from "../../i18n/type";


export const HistoryPanel = () => {
  const {historyArray, historyCurrent, applyHistoryNode} = useContext(EditorContext);
  const {t} = useTranslation();
  const scrollEle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollEle.current) {
      // Scroll to the element after rendering
      scrollEle.current.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, []);

  return (
    <div className={'h-30 overflow-auto'}>
      <h1>History</h1>
      <div className={'flex flex-col space-x-2 space-y-2 p-4 bg-gray-100'}>
        {
          historyArray.map((historyNode, index) => {
              const isCurr = historyNode === historyCurrent
              const {label, tooltip} = t(historyNode.value.type, {returnObjects: true}) as I18nHistoryDataItem

              return <div key={index}
                          title={tooltip}
                          ref={isCurr ? scrollEle : null}
                          onClick={() => {
                            if (isCurr) return;
                            console.log('current', historyNode);
                            return applyHistoryNode(historyNode);
                          }}
                          className={`flex p-1 cursor-pointer text-sm hover:bg-blue-200`}>
                {isCurr && '・'}
                <span>{label}</span>
              </div>
            }
          )
        }

      </div>
    </div>
  );
};