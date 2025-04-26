import Editor from '../../editor.ts'
import AssetsManager from '../../assetsManager/AssetsManager.ts'
import {ImageProps} from '../../../core/modules/shapes/image.ts'

function handleDrop(this: Editor, e: DragEvent) {
  e.preventDefault()

  console.log(e)
  const ox = e.clientX - this.viewport.rect!.x
  const oy = e.clientY - this.viewport.rect!.y
  const worldPoint = this.getWorldPointByViewportPoint(ox, oy)
  const file = e.dataTransfer?.files[0]
  // console.log(file)
  AssetsManager.resolve(file!).then(asset => {
    this.assetsManager.add(asset)
    console.log(asset.imageRef!.width, asset.imageRef!.height)
    const {width, height} = asset.imageRef!
    const newImgProp: ImageProps = {
      type: 'image',
      enableLine: false,
      src: asset.id,
      x: worldPoint.x,
      y: worldPoint.y,
      width,
      height,
    }

    this.action.dispatch('module-add', [newImgProp])
  }).catch(err => {

  })

  // console.log(a)
  // this.assetsManager.add()

  // document.body.append(img)
  // this.batchCreate()

  // console.log(r)
  /*  console.log(file.arrayBuffer())
    file.arrayBuffer().then(data => {
      console.log(data)
    })*/
  /*
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        console.log(event.target!.result)
        const url = URL.createObjectURL(new Blob([event.target!.result]))
        console.log(url)
      }
      reader.readAsArrayBuffer(file)
    } else {
      alert('Only image files are allowed!')
    }*/
}

export default handleDrop

