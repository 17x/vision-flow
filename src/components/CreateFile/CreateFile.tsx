import {FC, FormEvent, useRef, useState} from 'react'
import uid from '../../utilities/Uid.ts'
import {useFile, VisionFileType} from '../fileContext/FileContext.tsx'
import {Button, Col, Con, Input, MenuItem, Modal, P, Panel, Row, Select, SelectItem, Title} from '@lite-u/ui'
import {PAGE_PRESETS} from './pagePresets.ts'
import {useTranslation} from 'react-i18next'
import {Unit} from '@editor/type.ts'
import convertUnit from '@editor/lib/converter.ts'
import {VISION_VERSION} from '../../constants'

const CreateFile: FC<{ bg: string, onBgClick?: VoidFunction }> = ({bg = '#00000066', onBgClick}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const {t} = useTranslation()
  const {createFile, handleCreating} = useFile()
  const [currentPageSet, setCurrentPageSet] = useState({...PAGE_PRESETS[0]})
  const [dpi, setDpi] = useState(72)
  const [error, setError] = useState('')
  const validateFileName = (str: string) => {
    return /^[a-zA-Z0-9-_ ]+$/.test(str)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!validateFileName(currentPageSet.name)) {
      setError('File names may only contain alphabetic characters, numbers, and spaces.')
      return
    }

    setError('')
    const fileId = uid()

    const newFile: VisionFileType = {
      id: fileId,
      name: currentPageSet.name,
      version: VISION_VERSION,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      config: {
        page: {
          dpi,
          ...currentPageSet,
        },
      },
      workspace: [
        {
          name: 'workspace-1',
          data: [],
        },
      ],
    }

    createFile(newFile)
    handleCreating(false)
  }

  const handleChange = (key: string, value: number | string) => {
    setCurrentPageSet(prevState => {
      return {
        ...prevState,
        [key]: value,
      }
    })
  }

  const handleNewUnit = (newUnit: Unit) => {
    const {name, unit, width, height} = currentPageSet
    const newWidth = Number((convertUnit(width, unit, newUnit)).toFixed(2))
    const newHeight = Number((convertUnit(height, unit, newUnit)).toFixed(2))

    setCurrentPageSet({
      name,
      width: newWidth,
      height: newHeight,
      unit: newUnit,
    })
  }

  return <Modal backdropBg={bg} style={{
    zIndex: 1000,
  }} onBackdropClick={() => onBgClick && onBgClick()}>
    <Col w={'90%'} h={'90%'} className={'shadow-md rounded-sm shadow-gray-600 overflow-hidden  text-sm'}>
      <Panel title={t('file.CreateTitle')}>
        <Row stretch center fh className={'p-4'}>

          <Con p={4} bg={'white'}>
            <Title h2>Templates</Title>
            <Row className={'overflow-auto flex-auto flex-wrap space-x-2 space-y-2'}>
              {
                PAGE_PRESETS.map((item, index) => {
                  const size = 100
                  const scale = size / Math.max(item.width, item.height)

                  return <Col key={index}
                              jc
                              center
                              w={120}
                              h={120}
                              className={'border overflow-hidden flex text-center   border-gray-200  cursor-pointer hover:border-gray-600'}
                              onClick={() => {
                                setCurrentPageSet({...item})
                              }}>
                    <Col center jc>
                      <Con w={size} h={size} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                      }}>
                        <svg style={{
                          width: '100%',
                          height: '100%',
                        }} viewBox={`0 0 ${item.width} ${item.height}`}>
                          <rect width={item.width}
                                height={item.height}
                                strokeWidth={1 / scale}
                                stroke={'black'}
                                fill={'#ffd6d6'}/>
                        </svg>
                      </Con>
                      <Con p={2} h={30}>{item.name}</Con>
                    </Col>
                  </Col>
                })
              }
            </Row>
          </Con>

          <Con w={'30%'} p={10}>
            <Col fh stretch>
              <Title h2>Presets</Title>
              <form ref={formRef}
                    className={'h-full relative min-h-30 z-20'}
                    onSubmit={handleSubmit}>
                <Col fh between center>
                  <Con>
                    <P style={{marginTop: 10}}>File Name</P>
                    <Input name={'filename'}
                           value={currentPageSet.name}
                           onChange={(e) => {
                             handleChange('name', e.target.value)
                           }}
                           type={'text'}/>
                    <P style={{color: 'red'}}>{error}</P>
                    <P style={{marginTop: 10}}>Page Width</P>
                    <Input name={'width'}
                           placeholder="enter page width"
                           value={currentPageSet.width}
                           onChange={(e) => {
                             handleChange('width', e.target.value)
                           }}
                           type={'number'}/>

                    <P style={{marginTop: 10}}>Page Height</P>
                    <Input name={'height'}
                           placeholder="enter page height"
                           value={currentPageSet.height}
                           onChange={(e) => {
                             handleChange('height', e.target.value)
                           }}
                           type={'number'}/>

                    <P style={{marginTop: 10}}>Unit</P>
                    <Select defaultValue={currentPageSet.unit}
                            onChange={(v) => {
                              handleNewUnit(v as Unit)
                            }}>
                      <SelectItem value={'px'}><MenuItem>px</MenuItem></SelectItem>
                      <SelectItem value={'mm'}><MenuItem>mm</MenuItem></SelectItem>
                      <SelectItem value={'cm'}><MenuItem>cm</MenuItem></SelectItem>
                    </Select>

                    <P style={{marginTop: 10}}>DPI</P>
                    <Select defaultValue={dpi} onChange={(newDpi) => {
                      setDpi(newDpi as number)
                    }}>
                      <SelectItem value={300}><MenuItem>300</MenuItem></SelectItem>
                      <SelectItem value={96}><MenuItem>96</MenuItem></SelectItem>
                      <SelectItem value={72}><MenuItem>72</MenuItem></SelectItem>
                    </Select>

                  </Con>

                  <Button primary type={'submit'}>Create File</Button>
                </Col>
              </form>
            </Col>
          </Con>
        </Row>

      </Panel>
    </Col>
  </Modal>
}

export default CreateFile