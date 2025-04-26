import Rectangle, {RectangleProps} from './rectangle'

export interface TextProps extends RectangleProps {
  type: 'text'
  textColor: string
  content: string
  font: string
  fontSize: number
  alignment: string
  bold: boolean
  italics: boolean
  underlines: boolean
  throughLine: boolean
  lineHeight: number
}

class ElementText extends Rectangle {
  // readonly type = 'text'
  textColor: string
  content: string
  font: string
  fontSize: number
  alignment: string
  bold: boolean
  italics: boolean
  underlines: boolean
  throughLine: boolean
  lineHeight: number

  constructor({
                textColor,
                content,
                font,
                fontSize,
                alignment,
                bold,
                italics,
                underlines,
                throughLine,
                lineHeight,
                ...rest
              }: Omit<TextProps, 'type'>) {
    super({...rest})
    this.textColor = textColor
    this.content = content
    this.font = font
    this.fontSize = fontSize
    this.alignment = alignment
    this.bold = bold
    this.italics = italics
    this.underlines = underlines
    this.throughLine = throughLine
    this.lineHeight = lineHeight
  }

  public getDetails<T extends boolean>(includeIdentifiers: T = true as T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'> {
    return {
      content: this.content,
      textColor: this.textColor,
      ...super.getDetails(includeIdentifiers),
    } as T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'>
  }

  public getOperators(
    resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
  ) {

    return super.getOperators(resizeConfig, rotateConfig, this.getRect(), this.getDetails(true))
  }

  render(ctx: CanvasRenderingContext2D): void {
    const {
      // content,
      // alignment,

      // width,
      // height,
      // radius,
    } = this
    let {content, alignment, textColor, x, y, width, height, rotation, opacity} = this
    // x = Math.round(x)
    // y = Math.round(y)
    // width = Math.round(width)
    // height = Math.round(height)
    // console.log(x, y, width, height)
    // const LocalX = x - width
    // const LocalY = y - height

    // Save current context state to avoid transformations affecting other drawings
    ctx.save()

    // Move context to the rectangle's center (Direct center point at x, y)
    ctx.translate(x, y)

    // Apply rotation if needed
    if (rotation! > 0) {
      ctx.rotate(rotation! * Math.PI / 180)
    }

    // Apply fill style if enabled
    if (opacity > 0) {
      ctx.globalAlpha = opacity / 100 // Set the opacity
    }

    // Fill if enabled
    if (opacity > 0) {
      ctx.font = '20px monospace'
      ctx.strokeStyle = 'blue'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      // ctx.beginPath()
      // ctx.fill()
      // ctx.strokeText(content, LocalX, LocalY, width)
      ctx.fillStyle = textColor
      ctx.fillText(content, 0, 0, width)
      // ctx.closePath()
    }

    // Stroke if enabled

    /*   if (gradient) {
         // Implement gradient rendering (as needed)
       }*/

    // Restore the context to avoid affecting subsequent drawings
    ctx.restore()
  }
}

export default ElementText