import {FC, FormEvent, useContext, useRef, useState} from 'react'
import uid from '../../utilities/Uid.ts'
import FileContext, {FileType} from '../fileContext/FileContext.tsx'
import {Button, Input, Modal, Panel} from '@lite-u/ui'
import {PAGE_PRESETS} from './pagePresets.ts'
import {useTranslation} from 'react-i18next'

const CreateFile: FC<{ bg: string, onBgClick?: VoidFunction }> = ({bg = '#00000066', onBgClick}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const {t} = useTranslation()
  const {createFile, handleCreating} = useContext(FileContext)
  const [currentPageSet, setCurrentPageSet] = useState({...PAGE_PRESETS[0]})
  const [error, setError] = useState('')
  const validateFileName = (str: string) => {
    return /^[a-zA-Z0-9-_ ]+$/.test(str)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // const filename = formRef.current?.filename.value.trim()
    // console.log(currentPageSet.name)
    if (!validateFileName(currentPageSet.name)) {
      setError('File name can only including number space and alpha')
      return
    }

    setError('')
    const fileId = uid()
    const newFile: FileType = {
      id: fileId,
      name: currentPageSet.name,
      config: {
        // dpr: 2,
        // moduleIdCounter: 0,
        scale: 0,
        offset: {x: 0, y: 0},
        page: {
          ...currentPageSet,
        },
        /*frame: {
          id: fileId + '-frame',
          width: 1000,
          height: 1414.142857,
          enableLine: true,
          lineColor: '#000000',
          lineWidth: 1,
          opacity: 100,
          shadow: false,
          rotation: 0,
          layer: -1,
          fillColor: '#fff',
          enableFill: true,
          x: 500,
          y: 707.0714285,
        },*/
      },
      data: [],
    }
    createFile(newFile)
    handleCreating(false)
  }
  console.log(currentPageSet)

  return <Modal backdropBg={bg} onBackdropClick={() => onBgClick && onBgClick()}>
    <div className={'w-[90%] h-[90%] bg-white flex flex-col p-4'}>
      <div className={'shadow-md rounded-sm shadow-gray-600 w-full h-full overflow-hidden  text-sm'}>
        <Panel title={t('file.CreateTitle')}>
          <div className={'h-full flex flex-row p-4'}>
            <div className={'bg-white p-4'}>
              <div className={'overflow-auto flex-auto flex flex-wrap space-x-2 space-y-2'}>
                {
                  PAGE_PRESETS.map((item, index) => {
                    return <div key={index}
                                className={'border flex text-center items-center justify-center border-gray-200 w-30 h-30 cursor-pointer hover:border-gray-600'}
                                onClick={() => {
                                  console.log(item)
                                  setCurrentPageSet({
                                    ...item,
                                    name: 'Untitled-' + item.name,
                                  })
                                }}>
                      <span>{item.name}</span>
                    </div>
                  })
                }
              </div>
            </div>
            <form ref={formRef}
                  className={'w-[300px] relative flex flex-col justify-between min-h-30 z-20 p-4 bg-white rounded-xl shadow-2xl'}
                  onSubmit={handleSubmit}>
              <div>
                <Input label={'File Name'} name={'filename'} placeholder="Enter file name" autoFocus
                       value={currentPageSet.name}
                       type={'number'}/>
                {/* <input type="text" autoFocus id="filename" name="filename"
                   placeholder="Enter file name"
                   className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"/>*/}
                <div>
                  <Input label={'width'} autoFocus defaultValue={currentPageSet.width} type={'number'}/>
                  <Input label={'unit'} autoFocus defaultValue={currentPageSet.unit} type={'number'}/>

                  <div>
                    <Input label={'height'} autoFocus defaultValue={currentPageSet.height} type={'number'}/>
                  </div>
                </div>
              </div>
              <Button type={'submit'} size={'sm'}> Create File </Button>
              {/*<button type="submit"
                  className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Create File
          </button>*/}
            </form>
          </div>
        </Panel>
        {/*<div
          className={'text-center h-8 flex justify-center items-center bg-gray-400 text-white'}>{t('file.CreateTitle')}</div>*/}

      </div>
    </div>

    {/*<form
      ref={formRef}
      className={'relative w-100 min-h-30 z-20 p-4 bg-white rounded-xl shadow-2xl'}
      onSubmit={handleSubmit}>
      <h1 className={'text-xl text-center'}>New File</h1>

      <label htmlFor="filename" className="block text-gray-700 font-medium mb-2">File Name</label>
      <input type="text" autoFocus id="filename" name="filename" placeholder="Enter file name"
             className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"/>
      {error && <div className={'text-red-500 my-2'}>{error}</div>}
      <label className={'justify-center'}>
        <button type="submit"
                className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300">
          Create File
        </button>
      </label>
    </form>*/}
  </Modal>
}

export default CreateFile