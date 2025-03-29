'use client'

import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux"
import {store} from "./redux/store.ts"

createRoot(document.getElementById('root')!).render(<Provider store={store}>
  <div className={'w-full h-full'}>
    <App/>

    {/*<div className={'fixed z-30 top-10 left-10 border w-[90%] h-[90%] bg-white rounded-xl'}><App/></div>*/}
  </div>
</Provider>)
