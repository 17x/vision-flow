// eslint disabled
import Editor from '../../engine/editor/editor.ts'
import {CircleRenderProps} from '../../engine/core/renderer/type'

const createBaseDataByType = <T extends ModuleNames>(type: T = 'rectangle' as T, x: number = 300, y: number = 300): PropsWithoutIdentifiers<T> => {
  if (type === 'ellipse') {
    return {
      type: 'ellipse',
      x,
      y,
      r1: x / 1.2,
      r2: x / 1.2,
      enableLine: true,
      lineColor: '#000',
      lineWidth: 1,
      enableFill: true,
      fillColor: '#f89f9f',
      opacity: 100,
      shadow: false,
      radius: 0,
      rotation: 0,
    } as CircleRenderProps
  }

  if (type === 'rectangle') {
    return {
      type: 'rectangle',
      x,
      y,
      width: x / 1.5,
      height: y / 1.5,
      enableLine: true,
      lineColor: '#000000',
      lineWidth: 1,
      enableFill: true,
      fillColor: '#fff',
      opacity: 100,
      shadow: false,
      radius: 0,
      rotation: 0,
    }
  }

  return null
}

export const createMockData = (editor: Editor) => {
  const baseX = 500
  const baseY = 500
  // const baseRectData = createBaseDataByType('rectangle')
  const baseRectData = createBaseDataByType('ellipse')
  // const MOCK_ELE_LEN = 1
  const MOCK_ELE_LEN = 1
  // const MOCK_ELE_LEN = 200
  // const MOCK_ELE_LEN = 10000
  // const shiftSpeed = 2
  const shiftSpeed = 100
  // const MOCK_ELE_LEN = 2
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getRandomHexColor = (): string => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
  }

  // @ts-ignore

  const getRandomNumber = (max: number): number => {
    return Math.floor(Math.random() * max)
  }

  // const modulesData = []

  /*  for (let i = 0; i < MOCK_ELE_LEN; i++) {
      // const x = getRandomNumber(1000)
      // const y = getRandomNumber(1414)
      const x = baseX + (i * shiftSpeed)
      const y = baseY + (i * shiftSpeed)
      // console.log(x)
      modulesData.push({
        ...baseRectData,
        // fillColor: getRandomHexColor(),
        fillColor: '#fff',
        x,
        y,
        layer: i + 1,
        // rotation: i + 10,
        rotation: 0,
      })
    }*/
  const modulesData = []

  // modulesData.push(createBaseDataByType('ellipse'))
  // modulesData.push(createBaseDataByType('ellipse', 300, 700))
  modulesData.push(createBaseDataByType('rectangle', 500, 500))
  editor.action.dispatch('module-add', modulesData)
}