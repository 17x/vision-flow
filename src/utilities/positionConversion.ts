interface Params {
  pos: Point
  zoom: ZoomRatio;
  dpr: DPR;
}

const screenPositionToLogical = ({pos, zoom, dpr}: Params): Point => {
  return {
    x: pos.x / (zoom * dpr),
    y: pos.y / (zoom * dpr)
  }
}

const LogicalPositionToScreen = ({pos, zoom, dpr}: Params): Point => {
  return {
    x: pos.x * zoom * dpr,
    y: pos.y * zoom * dpr
  }
}

export {screenPositionToLogical, LogicalPositionToScreen}