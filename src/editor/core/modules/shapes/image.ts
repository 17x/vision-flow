import Rectangle, {RectangleProps} from './rectangle'

export interface ImageProps extends RectangleProps {
  type: 'image'
  src: string
}

class ElementImage extends Rectangle {
  src: string

  constructor({
                src,
                ...rest
              }: Omit<ImageProps, 'type'>) {
    super({...rest})

    this.src = src
  }

  public getDetails<T extends boolean>(includeIdentifiers: T = true as T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'> {
    return {
      src: this.src,
      ...super.getDetails(includeIdentifiers),
    } as T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'>
  }

  public getOperators(
    resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
  ) {

    return super.getOperators(resizeConfig, rotateConfig, this.getRect(), this.getDetails(true))
  }

  render(ctx: CanvasRenderingContext2D, img: HTMLImageElement): void {
    const {
      // content,
      // alignment,

      // width,
      // height,
      // radius,
    } = this
    let {/*src, */x, y, width, height, rotation, opacity} = this
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
      // console.log(asset)
      ctx.drawImage(img, -width / 2, -height / 2, width, height)
      // ctx.drawImage()
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

export default ElementImage