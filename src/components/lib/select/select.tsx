import React, {FC, useState} from "react";
import {Globe} from 'lucide-react'

interface SelectProps {
  children: React.ReactNode[]
  defaultValue: string
}

const Select: FC<SelectProps> = ({children, defaultValue}) => {
  const [showList, setShowList] = useState(false)

  return <div className={'relative w-20'}>
    <div className={'flex items-center'} onClick={() => {
      setShowList(!showList)
    }}>
      <Globe/>
      {defaultValue}</div>

    {
      showList && <div
            onClick={() => {
              setShowList(false)
            }}
            className={'absolute top-full right-0 w-full'}>
        {children}
        </div>
    }
  </div>

}

export default Select