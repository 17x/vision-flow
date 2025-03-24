import {useEffect} from "react";
import {useTranslation} from "react-i18next";

export const LayerPanel = () => {
  const {t} = useTranslation();

  useEffect(() => {

  }, []);

  return (
    <div className={'p-2'}>
      <h1 className={'bg-gray-400 text-white px-2'}><span>Layer</span></h1>
      <div className={'border h-20 border-gray-200 overflow-x-auto scrollbar-custom overflow-y-auto'}>

      </div>
    </div>
  );
};