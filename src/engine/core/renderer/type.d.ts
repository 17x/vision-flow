import {RectangleProps} from "../modules/shapes/rectangle.ts";

/*
export interface RectangleRenderProps extends RectangleProps {
  x: number
  y: number
  width: number
  height: number

  enableFill: boolean
  fillColor: string

  enableLine: boolean
  lineColor: string
  lineWidth: number

  enableGradient: boolean
  gradient: Gradient

  rotation: number
}*/
export type RectangleRenderProps = Pick<RectangleProps,
  'x' |
  'y' |
  'width' |
  'height' |
  'enableFill' |
  'fillColor' |
  'enableLine' |
  'lineColor' |
  'lineWidth' |
  'radius' |
  'opacity' |
  'enableGradient' |
  'gradient' |
  'rotation'
>
/*
export type OrderedProps = [
  x: number,
  y: number,
  width: number,
  height: number,
  enableFill: boolean,
  fillColor: string,
  enableLine: boolean,
  lineColor: string,
  lineWidth: number,
  radius: number,
  opacity: number,
  enableGradient: boolean,
  gradient: Gradient,
  rotation: number,
]*/
