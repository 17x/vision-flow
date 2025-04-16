export const HANDLER_OFFSETS = [
  {
    type: 'rotate',
    name: 'rotate-tl',
    x: 0,
    y: 0,
    offsetX: -5,
    offsetY: -5,
    originCursor: 'rotate',
    cursor: 'rotate',
  }, // left-center
  {
    type: 'rotate',
    name: 'rotate-tr',
    x: 1,
    y: 0,
    offsetX: 5,
    offsetY: -5,
    originCursor: 'rotate',
    cursor: 'rotate',
  }, // left-center
  {
    type: 'rotate',
    name: 'rotate-br',
    x: 1,
    y: 1,
    offsetX: 5,
    offsetY: 5,
    originCursor: 'rotate',
    cursor: 'rotate',
  }, // left-center
  {
    type: 'rotate',
    name: 'rotate-bl',
    x: 0,
    y: 1,
    offsetX: -5,
    offsetY: 5,
    originCursor: 'rotate',
    cursor: 'rotate',
  },
  {
    type: 'resize',
    name: 'tl',
    x: 0,
    y: 0,
    originCursor: 'nwse-resize',
    cursor: 'nwse-resize',
  }, // top-left
  {
    type: 'resize',
    name: 't',
    x: 0.5,
    y: 0,
    originCursor: 'ns-resize',
    cursor: 'ns-resize',
  }, // top-center
  {
    type: 'resize',
    name: 'tr',
    x: 1,
    y: 0,
    originCursor: 'nesw-resize',
    cursor: 'nesw-resize',
  }, // top-right
  {
    type: 'resize',
    name: 'r',
    x: 1,
    y: 0.5,
    originCursor: 'ew-resize',
    cursor: 'ew-resize',
  }, // right-center
  {
    type: 'resize',
    name: 'br',
    x: 1,
    y: 1,
    originCursor: 'nwse-resize',
    cursor: 'nwse-resize',
  }, // bottom-right
  {
    type: 'resize',
    name: 'b',
    x: 0.5,
    y: 1,
    originCursor: 'ns-resize',
    cursor: 'ns-resize',
  }, // bottom-center
  {
    type: 'resize',
    name: 'bl',
    x: 0,
    y: 1,
    originCursor: 'nesw-resize',
    cursor: 'nesw-resize',
  }, // bottom-left
  {
    type: 'resize',
    name: 'l',
    x: 0,
    y: 0.5,
    originCursor: 'ew-resize',
    cursor: 'ew-resize',
  }, // left-center
  // left-center
] as const

