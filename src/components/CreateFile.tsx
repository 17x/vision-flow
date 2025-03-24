import {FC, useContext, useRef} from "react";
import uid from "../utilities/Uid.ts";
import FileContext, {FileType} from "./fileContext/FileContext.tsx";

const CreateFile: FC<{ bg: string }> = ({bg = '#fff'}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const {createFile, handleCreating} = useContext(FileContext)

  const handleSubmit = () => {
    const filename = (formRef.current?.filename.value.trim())

    if (!filename) {
      return;
    }

    const newFile: FileType = {
      id: uid(),
      name: filename,
      data: {}, config: {},
    }

    createFile(newFile)
    handleCreating(false)
  }

  return <div
    style={{
      backgroundColor: bg
    }}
    className={`fixed top-0 left-0 z-20 w-full h-full flex flex-row items-center justify-center text-sm select-none`}>
    <form
      ref={formRef}
      className={'p-4 bg-white rounded-xl shadow-2xl'}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit()
      }}>
      <h1 className={'text-xl text-center'}>New File</h1>

      <label htmlFor="filename" className="block text-gray-700 font-medium mb-2">File Name</label>
      <input type="text" autoFocus id="filename" name="filename" placeholder="Enter file name"
             className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"/>

      <label className={'justify-center'}>
        <button type="submit"
                className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300">
          Create File
        </button>
      </label>
    </form>
  </div>
};

export default CreateFile