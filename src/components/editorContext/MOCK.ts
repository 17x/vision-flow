import Editor from '../../engine/editor/editor.ts'

export const createMockData = (editor: Editor) => {
  const baseX = 100
  const baseY = 100
  const baseRectData: Omit<ShapePropsType, 'id' | 'layer'> = {
    type: 'rectangle',
    x: 100,
    y: 100,
    width: 100,
    height: 100,
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
  // const MOCK_ELE_LEN = 1000
  const MOCK_ELE_LEN = 200
  const shiftSpeed = 10
  // const MOCK_ELE_LEN = 2
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getRandomHexColor = (): string => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
  }

  const getRandomNumber = (max: number): string => {
    return Math.floor(Math.random() * max)
  }

  const modulesData = []

  for (let i = 0; i < MOCK_ELE_LEN; i++) {
    const x =   getRandomNumber(1000)
    const y =  getRandomNumber(1414)
    // x: baseX + (i * shiftSpeed),
    //   y: baseY + (i * shiftSpeed),
    // console.log(x)
    modulesData.push({
      ...baseRectData,
      // fillColor: getRandomHexColor(),
      fillColor: '#ed1c24',
      x,
      y,
      layer: i + 1,
      rotation: i + 10,
    })
  }

  const instantiations = editor.batchCreate(modulesData)

  editor.batchAdd(instantiations, 'history-add')
}