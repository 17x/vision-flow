import {RectangleRenderProps} from '../../core/renderer/type'

export type ViewportEventType =
  'viewport-resize'
  | 'viewport-mouse-down'
  | 'viewport-mouse-move'
  | 'viewport-mouse-up'
  | 'world-zoom'
  | 'world-shift'

export type ViewportManipulationType =
  | 'static'
  | 'mousedown'
  | 'panning'
  | 'dragging'
  | 'resizing'
  | 'rotating'
  | 'zooming'
  | 'selecting'

export interface Viewport {
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
  zooming: boolean
  /*
  * frame
  *
  * A rect that based on world coordinate, x=0, y=0
  * Its size can be modified
  * */
  frame: Partial<RectangleRenderProps> & BoundingRect
  /*
  * mouseDownPoint
  * relative position to wrapper's top-left
  * */
  mouseDownPoint: Point
  mouseMovePoint: Point
  offset: Point
  rect: BoundingRect
  /*
  * viewportRect:
  *
  * Its width equals to Canvas real width, and height also
  *
  * width = canvas.style.width * dpr
  *
  * height = canvas.style.height * dpr
  * */
  viewportRect: BoundingRect
  worldRect: BoundingRect
  scale: number
  enableCrossLine: boolean
  drawCrossLineDefault: boolean
  drawCrossLine: boolean
}
