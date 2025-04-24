import {FC, FormEvent, useContext, useRef, useState} from 'react'
import uid from '../../utilities/Uid.ts'
import FileContext, {FileType} from '../fileContext/FileContext.tsx'
import {Button, Col, Con, Input, Modal, P, Panel, Row, Select, SelectItem, Title} from '@lite-u/ui'
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

  // console.log(currentPageSet.name)

  return <Modal backdropBg={bg} onBackdropClick={() => onBgClick && onBgClick()}>
    <Col w={'90%'} h={'90%'} className={'shadow-md rounded-sm shadow-gray-600 overflow-hidden  text-sm'}>
      <Panel title={t('file.CreateTitle')}>
        <Row stretch center fh className={'p-4'}>
          <Con p={4} bg={'white'}>
            <Title h2>Templates</Title>
            <Row className={'overflow-auto flex-auto flex-wrap space-x-2 space-y-2'}>
              {
                PAGE_PRESETS.map((item, index) => {
                  return <Col key={index}
                              jc
                              center
                              w={120}
                              h={120}
                              className={'border overflow-hidden flex text-center   border-gray-200  cursor-pointer hover:border-gray-600'}
                              onClick={() => {
                                setCurrentPageSet((prev) => {
                                  return {
                                    ...item,
                                    name: prev.name,
                                  }
                                })
                              }}>
                    <Col center jc>
                      <Con w={100} h={100} style={{
                        // objectFit:'contain'
                      }}>
                        {/*<canvas
                          width={item.width}
                          height={item.height}
                          style={{
                            background: 'blue',
                            // aspectRatio: item.width / item.height,
                            // width: item.width,
                            // height: item.height,
                            // width: '100%',
                            // height: '100%',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            display:'inline-block',
                            objectFit: 'contain',
                          }}></canvas>*/}
                      </Con>
                      <span>{item.name}</span>
                    </Col>
                  </Col>
                })
              }
            </Row>
          </Con>

          <form ref={formRef}
                className={'w-[300px] relative min-h-30 z-20 p-4'}
                onSubmit={handleSubmit}>
            <Col fh between>
              <div>
                <Input label={'File Name'}
                       name={'filename'}
                       placeholder="Enter file name"
                       value={currentPageSet.name}
                       type={'text'}/>
                {/* <input type="text" autoFocus id="filename" name="filename"
                   placeholder="Enter file name"
                   className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"/>*/}
                <div>
                  <Input label={'width'} value={currentPageSet.width} type={'number'}/>

                  <Select label={'unit'}>
                    <SelectItem value={'px'}>unit</SelectItem>
                    <SelectItem value={'mm'}>unit</SelectItem>
                    <SelectItem value={'cm'}>unit</SelectItem>
                  </Select>

                  <div>
                    <Input label={'height'} value={currentPageSet.height} type={'number'}/>
                  </div>
                </div>
              </div>

              <Button primary type={'submit'}>Create File</Button>
              {/*<button type="submit"
                  className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Create File
          </button>*/}
            </Col>
          </form>
        </Row>

      </Panel>
    </Col>
  </Modal>
}

export default CreateFile