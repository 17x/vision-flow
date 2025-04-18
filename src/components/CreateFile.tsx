import {FC, FormEvent, useContext, useRef, useState} from 'react'
import uid from '../utilities/Uid.ts'
import FileContext, {FileType} from './fileContext/FileContext.tsx'

const CreateFile: FC<{ bg: string, onBgClick?: VoidFunction }> = ({bg = '#fff', onBgClick}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const {createFile, handleCreating} = useContext(FileContext)
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
        frame: {
          id: fileId + '-frame',
          width: 1000,
          height: 1414.142857,
          type: 'rectangle',
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

  return <div
    className={`fixed top-0 left-0 z-20 w-full h-full flex flex-row items-center justify-center text-sm select-none`}>
    <div
      style={{
        backgroundColor: bg,
      }}
      onClick={() => onBgClick && onBgClick()}
      className={'absolute top-0 left-0 w-full h-full flex flex-row items-center justify-center text-sm select-none'}>
    </div>

    <form
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
    </form>
  </div>
}

export default CreateFile