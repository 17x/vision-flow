interface Params {
  pos: Position
  zoom: ZoomRatio;
  dpr: DPR;
}

const screenPositionToLogical = ({pos, zoom, dpr}: Params): Position => {
  return {
    x: pos.x / (zoom * dpr),
    y: pos.y / (zoom * dpr)
  }
}

const LogicalPositionToScreen = ({pos, zoom, dpr}: Params): Position => {
  return {
    x: pos.x * zoom * dpr,
    y: pos.y * zoom * dpr
  }
}

export {screenPositionToLogical, LogicalPositionToScreen}