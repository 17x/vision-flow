import {FC, FormEvent, useContext, useRef, useState} from 'react'
import uid from '../../utilities/Uid.ts'
import FileContext, {FileType} from '../fileContext/FileContext.tsx'
import {Button, Input, Modal} from '@lite-u/ui'
import {PAGE_PRESETS} from './pagePresets.ts'
import {useTranslation} from 'react-i18next'

const CreateFile: FC<{ bg: string, onBgClick?: VoidFunction }> = ({bg = '#00000066', onBgClick}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const {t} = useTranslation()
  const {createFile, handleCreating} = useContext(FileContext)
  const [currentPageSet, setCurrentPageSet] = useState({
    unit: 'mm',
    width: 210,
    height: 297,
  })
  const [error, setError] = useState('')
  const validateFileName = (str: string) => {
    return /^[a-zA-Z0-9-_ ]+$/.test(str)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const filename = formRef.current?.filename.value.trim()

    if (!validateFileName(filename)) {
      setError('File name can only including number space and alpha')
      return
    }

    setError('')
    const fileId = uid()
    const newFile: FileType = {
      id: fileId,
      name: filename,
      config: {
        dpr: 2,
        scale: 0,
        offset: {x: 0, y: 0},
        moduleIdCounter: 0,
        frame: {
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
        },
      },
      data: [],
    }
    createFile(newFile)
    handleCreating(false)
  }

  return <Modal backdropBg={bg} onBackdropClick={() => onBgClick && onBgClick()}>
    <div className={'w-[90%] h-[90%] bg-white overflow-hidden flex flex-col border'}>
      <div className={'text-center h-20 flex justify-center items-center'}>{t('file.CreateTitle')}</div>
      <div className={'h-full flex flex-row p-4'}>
        <div className={'bg-white p-4'}>
          <div className={'overflow-auto flex-auto flex flex-wrap space-x-2 space-y-2'}>
            {
              PAGE_PRESETS.map((item, index) => {
                return <div key={index}
                            className={'border border-gray-200 w-30 h-30 cursor-pointer hover:border-gray-600'}
                            onClick={() => {

                            }}>
                  {item.name}
                </div>
              })
            }
          </div>
        </div>
        <div className={'w-[300px] h-full flex flex-col justify-between'}>
          <div>
            <span>width:</span> <Input value={currentPageSet.width} type={'number'}/>
            <span>unit:</span> <Input value={currentPageSet.unit} type={'text'}/>
          </div>
          <div>
            <span>height:</span> <Input value={currentPageSet.height} type={'number'}/>
          </div>
          <Button type={'button'} size={'sm'}>
            hello
          </Button>
          <button type="submit"
                  className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Create File
          </button>
        </div>
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