import {RectangleProps} from '../modules/shapes/rectangle.ts'

export interface RectangleRenderProps extends Omit<RectangleProps, 'id' | 'layer' | 'type'> {
  shadow?: string
}

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

interface TextRenderProps {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

export interface CircleRenderProps {
  x: number
  y: number
  r1: number
  r2: number
  fillColor?: RectangleProps['fillColor']
  lineWidth?: RectangleProps['lineWidth']
  lineColor?: RectangleProps['lineColor']
  dashLine?: string
  radius?: RectangleProps['radius']
  opacity?: RectangleProps['opacity']
  gradient?: RectangleProps['gradient']
  rotation?: RectangleProps['rotation']
}