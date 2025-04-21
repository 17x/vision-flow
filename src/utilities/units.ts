const conversionFactors = {
  mmToCm: 0.1,       // 1 mm = 0.1 cm
  cmToMm: 10,        // 1 cm = 10 mm
  mmToInches: 0.0393701,   // 1 mm = 0.0393701 inches
  inchesToMm: 25.4,  // 1 inch = 25.4 mm
  cmToInches: 0.393701,     // 1 cm = 0.393701 inches
  inchesToCm: 2.54,  // 1 inch = 2.54 cm
  pxToInches: 1 / 96,  // 1 px = 1/96 inches (standard screen DPI)
  pxToCm: 1 / 37.795275591,  // 1 px = 1/37.795 cm (standard screen DPI)
}

const convertUnit = (value: number, fromUnit: string, toUnit: string): number => {
  if (fromUnit === 'mm' && toUnit === 'cm') return value * conversionFactors.mmToCm
  if (fromUnit === 'cm' && toUnit === 'mm') return value * conversionFactors.cmToMm
  if (fromUnit === 'mm' && toUnit === 'inches') return value * conversionFactors.mmToInches
  if (fromUnit === 'inches' && toUnit === 'mm') return value * conversionFactors.inchesToMm
  if (fromUnit === 'cm' && toUnit === 'inches') return value * conversionFactors.cmToInches
  if (fromUnit === 'inches' && toUnit === 'cm') return value * conversionFactors.inchesToCm
  if (fromUnit === 'px' && toUnit === 'inches') return value * conversionFactors.pxToInches
  if (fromUnit === 'px' && toUnit === 'cm') return value * conversionFactors.pxToCm
  if (fromUnit === 'inches' && toUnit === 'px') return value / conversionFactors.pxToInches
  if (fromUnit === 'cm' && toUnit === 'px') return value / conversionFactors.pxToCm

  return value
}
export default convertUnit