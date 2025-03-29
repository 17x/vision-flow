// import {IntRange} from "type-fest"

declare global {
  type UID = string
  type HexColor = string
  type FillColor = HexColor
  // type Opacity = IntRange<1, 101>
  type Opacity = number
  type Rotation = number
  type Shadow = boolean
  type Gradient = string
}
export {}
