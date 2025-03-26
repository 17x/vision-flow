import {useEffect, useRef} from "react";
// import {useTranslation} from "react-i18next";
import OptimizedDND from "./OptimizedDND.ts";

interface LayerPanelProps {
  data: ModuleType[]
}

export const LayerPanel = ({data}: LayerPanelProps) => {
  // const {t} = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
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
  }, [data]);

  return (
    <div className={'p-2'}>
      <h1 className={'bg-gray-400 text-white px-2'}><span>Layer</span></h1>
      <div ref={scrollRef} className={'border h-30 border-gray-200 select-none'}></div>
    </div>
  );
};