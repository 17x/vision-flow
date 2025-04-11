import Editor from '../../engine/editor/editor.ts'

export const createMockData = (editor: Editor) => {
  const baseX = 200
  const baseY = 300
  const baseRectData: Omit<ShapePropsType, 'id' | 'layer'> = {
    type: 'rectangle',
    // x: 150,
    // y: 150,
    width: baseX * 2,
    height: baseY * 2,
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
  // const MOCK_ELE_LEN = 1
  const MOCK_ELE_LEN = 10
  // const MOCK_ELE_LEN = 200
  // const MOCK_ELE_LEN = 1000
  const shiftSpeed = 10
  // const shiftSpeed = 100
  // const MOCK_ELE_LEN = 2
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getRandomHexColor = (): string => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
  }

  const getRandomNumber = (max: number): number => {
    return Math.floor(Math.random() * max)
  }

  const modulesData = []

  for (let i = 0; i < MOCK_ELE_LEN; i++) {
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
      rotation: 30,
    })
  }

  editor.action.dispatch('module-add', modulesData)
}