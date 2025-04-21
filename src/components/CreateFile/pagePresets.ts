type PageUnit = 'px' | 'mm' | 'cm'

export interface PagePreset {
  name: string
  unit: PageUnit
  width: number
  height: number
}

export const PAGE_PRESETS: PagePreset[] = [{
  name: 'A4',
  width: 21,
  height: 297,
  unit: 'mm',
}]