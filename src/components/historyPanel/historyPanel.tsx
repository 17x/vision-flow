import {useContext, useEffect, useRef} from "react";
import {EditorContext} from "../EditorContext.tsx";
import {useTranslation} from "react-i18next";
import {I18nHistoryDataItem} from "../../i18n/type";


export const HistoryPanel = () => {
  const {historyArray, historyCurrent, applyHistoryNode} = useContext(EditorContext);
  const {t} = useTranslation();
  const parentRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(targetRef.current, parentRef.current);
    if (targetRef.current && parentRef.current) {
      const targetElement = targetRef.current;
      const parentElement = parentRef.current;

      // Calculate the scroll position required to bring the target element into view
      const targetOffsetTop = targetElement.offsetTop;
      const parentScrollTop = parentElement.scrollTop;

      // Scroll the parent container to keep the element focused
      parentElement.scrollTo({
        top: targetOffsetTop - parentScrollTop, // Adjust the scroll position
        behavior: 'smooth', // Smooth scroll animation
      });
    }
  }, []);

  return (
    <div ref={parentRef} className={'h-60 overflow-x-hidden overflow-y-auto'}>
      <h1>History</h1>
      <div className={'flex flex-col space-x-2 space-y-2 p-4 bg-gray-100'}>
        {
          historyArray.map((historyNode, index) => {
              const isCurr = historyNode === historyCurrent
              const {label, tooltip} = t(historyNode.value.type, {returnObjects: true}) as I18nHistoryDataItem
              return <div key={index}
                          title={tooltip}
                          ref={isCurr ? targetRef : null}
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