type Background = string

interface Grid {
  enabled: boolean;
  color: string;
  lineWidth: number;
}

interface Shape {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
}

interface Typography {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  bold: boolean;
  italic: boolean;
}

interface Shadow {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

interface Animation {
  enabled: boolean;
  frameRate: number;
  easing: string;
}

declare global {
  interface ThemeShape {
    background: Background;
    foreground: string;
    grid: Grid;
    shapes: {
      default: Shape;
      highlighted: Shape;
    };
    typography: Typography;
    shadows: Shadow;
    animation: Animation;
  }

  type ThemeSpecKey = string

  interface ThemeSpec {
    [key: ThemeSpecKey]: ThemeShape
  }
}

export {}
