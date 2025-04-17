export function pxToMm(px: number, dpi: number = 96): number {
  return (px * 25.4) / dpi
}

export function mmToPx(mm: number, dpi: number = 96): number {
  return (mm * dpi) / 25.4
}