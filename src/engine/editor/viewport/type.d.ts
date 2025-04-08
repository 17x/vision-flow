import {RectangleRenderProps} from '../../core/renderer/type'

export type ViewportEventType =
  'viewport-resize'
  | 'viewport-mouse-down'
  | 'viewport-mouse-move'
  | 'viewport-mouse-up'
  | 'world-zoom'
  | 'world-shift'

export interface Viewport {
  // editor: Editor
  resizeObserver: ResizeObserver
  wrapper: HTMLDivElement
  scrollBarX: HTMLDivElement
  scrollBarY: HTMLDivElement
  selectionBox: HTMLDivElement
  selectionCanvas: HTMLCanvasElement
  selectionCTX: CanvasRenderingContext2D
  mainCanvas: HTMLCanvasElement
  mainCTX: CanvasRenderingContext2D
  eventsController: AbortController
  initialized: boolean
  dpr: number
  spaceKeyDown: boolean
  // hoveredModules: Set<UID>
  // handlingModules: Set<UID>
  zooming: number
  manipulationStatus: ViewportManipulationType
  frame: Partial<RectangleRenderProps> & BoundingRect
  mouseDownPoint: Point
  mouseMovePoint: Point
  offset: Point
  rect: BoundingRect
  viewportRect: BoundingRect
  worldRect: BoundingRect
  // domResizing: boolean
  scale: number
  enableCrossLine: boolean
  drawCrossLineDefault: boolean
  drawCrossLine: boolean

}
