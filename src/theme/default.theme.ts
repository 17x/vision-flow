const defaultTheme: ThemeShape = {
  "background": "#1e1e1e",
  "foreground": "#ffffff",
  "grid": {
    "enabled": true,
    "color": "#444",
    "lineWidth": 0.5
  },
  "shapes": {
    "default": {
      "fillColor": "#3498db",
      "strokeColor": "#2980b9",
      "strokeWidth": 2
    },
    "highlighted": {
      "fillColor": "#e74c3c",
      "strokeColor": "#c0392b",
      "strokeWidth": 3
    }
  },
  "typography": {
    "fontFamily": "Arial, sans-serif",
    "fontSize": 14,
    "fontColor": "#ffffff",
    "bold": false,
    "italic": false
  },
  "shadows": {
    "enabled": true,
    "color": "rgba(0, 0, 0, 0.5)",
    "blur": 10,
    "offsetX": 3,
    "offsetY": 3
  },
  "animation": {
    "enabled": true,
    "frameRate": 60,
    "easing": "ease-in-out"
  }
}

export default defaultTheme