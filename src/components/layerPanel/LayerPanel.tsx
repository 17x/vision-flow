import {useEffect, useMemo, useRef} from "react";
// import {useTranslation} from "react-i18next";
// import OptimizedDND from "./OptimizedDND.ts";

interface LayerPanelProps {
  data: ModuleType[]
  selected: UID[]
  handleSelectModule: (id: UID) => void;
}

export const LayerPanel = ({data, selected, handleSelectModule}: LayerPanelProps) => {
  // const {t} = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  /*
    const DNDRef = useRef<OptimizedDND>(null);
    useEffect(() => {
      if (scrollRef.current) {
        DNDRef.current = new OptimizedDND({
          ele: scrollRef.current,
          data
        })
      }

      return () => {
        if (DNDRef.current) {
          DNDRef.current.destroy()
        }
      }
    }, [data]);*/

  useEffect(() => {
    targetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    })
  }, [selected]);

  return (
    <div className={'p-2'}>
      <h1 className={'bg-gray-400 text-white px-2'}><span>Layer</span></h1>
      <div ref={scrollRef}
           className={'scrollbar-custom overflow-x-hidden overflow-y-scroll p-2 border h-30 border-gray-200 select-none'}>
        {
          data?.map((item, index) => (
            <div ref={selected?.includes(item.id) ? targetRef : null}
                 className={selected?.includes(item.id) ? 'bg-gray-400 text-white' : ''}
                 onClick={() => handleSelectModule(item.id)}
                 id={`layer-module-${item.id}`}
                 key={index}>{item.type}</div>))
        }
      </div>
    </div>
  );
};