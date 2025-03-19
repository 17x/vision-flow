import {useContext, useEffect, useRef} from "react";
import {EditorContext} from "../EditorContext.tsx";
import {useTranslation} from "react-i18next";
import {I18nHistoryDataItem} from "../../i18n/type";

let _timer = null

export const HistoryPanel = () => {
  const {historyArray, historyCurrent, applyHistoryNode} = useContext(EditorContext);
  const {t} = useTranslation();
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (targetRef.current) {
      const targetElement = targetRef.current;

      const _timer = setTimeout(() => {
        targetElement.scrollIntoView({block: "center"})
      }, 0)

      return () => {
        if (_timer) {
          clearTimeout(_timer)
        }
      }
    }
  }, [historyArray, historyCurrent]);

  return (
    <div className={'h-60 overflow-x-hidden overflow-y-auto'}>
      <h1>History</h1>
      <div className={'flex flex-col space-x-2 p-4 bg-gray-100'}>
        {
          historyArray.map((historyNode, index) => {
              const isCurr = historyNode === historyCurrent
              const {label, tooltip} = t(historyNode.value.type, {returnObjects: true}) as I18nHistoryDataItem
              return <div key={index}
                          title={tooltip}
                          ref={isCurr ? targetRef : null}
                          onClick={() => {
                            if (isCurr) return;
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