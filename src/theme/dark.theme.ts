const darkModeTheme: ThemeShape = {
  "background": "#333333",
  "foreground": "#ffffff",
  "grid": {
    "enabled": true,
    "color": "#666666",
    "lineWidth": 1
  },
  "shapes": {
    "default": {
      "fillColor": "#808080",
      "strokeColor": "#999999",
      "strokeWidth": 1
    },
    "highlighted": {
      "fillColor": "#ff9900",
      "strokeColor": "#ffcc00",
      "strokeWidth": 2
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
    "color": "rgba(0, 0, 0, 0.75)",
    "blur": 15,
    "offsetX": 5,
    "offsetY": 5
  },
  "animation": {
    "enabled": true,
    "frameRate": 30,
    "easing": "ease-out"
  }
}

export default darkModeTheme