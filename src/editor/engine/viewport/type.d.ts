import {RectangleRenderProps} from '../../core/renderer/type'
import Rectangle from '../../core/modules/shapes/rectangle.ts'

export type ViewportEventType =
  'viewport-resize'
  | 'viewport-mouse-down'
  | 'viewport-mouse-move'
  | 'viewport-mouse-up'
  | 'world-zoom'
  | 'world-shift'

export type ViewportManipulationType =
  | 'static'
  | 'waiting'
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
  cursor: HTMLDivElement
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
  // frame: Rectangle
  /*
  * mouseDownPoint
  * relative position to wrapper's top-left
  * */
  mouseDownPoint: Point
  mouseMovePoint: Point
  offset: Point
  /* BoundingRect in the browser dom model*/
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
