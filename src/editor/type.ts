export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export type Rect = Size & Point
export type CenterBasedRect = Rect
export type BoundingRect = Size & Point & {
  top: number;
  bottom: number;
  left: number;
  right: number;
  cx: number;
  cy: number;
}
export type Resolution = Size
export type DPR = number
export type ZoomRatio = number
export enum Unit {
  MM = 'mm',
  INCHES = 'inches',
  PX = 'px',
  CM = 'cm'
}