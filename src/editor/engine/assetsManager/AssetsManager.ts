import nid from '@editor/lib/nid.ts'

export interface AssetsObj {
  id: string
  type: 'image' | 'svg' | 'font'
  file: File
  name: string
  imageRef?: HTMLImageElement
}

class AssetsManager {
  assetsMap: Map<string, AssetsObj> = new Map()

  constructor(assets: AssetsObj[] = []) {
    assets.forEach(asset => this.add(asset))
  }

  getAssetsObj(id: string): AssetsObj | false {
    return this.assetsMap.get(id) || false
  }

  add(asset: AssetsObj) {
    this.assetsMap.set(asset.id, asset)
  }

  static async resolve(file: File): Promise<AssetsObj> {
    return new Promise<AssetsObj>(async (resolve, reject) => {

      if (!file) {
        reject('File error')
      }

      if (!file!.type.startsWith('image/')) {
        reject('File format error')
      }

      const imageRef = await waitImageSize(file)

      resolve({
        id: nid(),
        type: 'image',
        file,
        imageRef,
        name: file.name,
      })

    })
  }

  destroy() {
    this.assetsMap.forEach((asset) => {
      // do sth
      if (asset.type === 'image') {
        URL.revokeObjectURL(asset.imageRef!.src)
      }
    })
  }
}

async function waitImageSize(file: File) {
  return new Promise<any>((resolve, reject) => {
    const imageRef = new Image()

    imageRef.onload = () => {
      resolve(imageRef)
    }

    imageRef.onerror = () => {
      reject('Load image size error')
    }

    imageRef.src = URL.createObjectURL(file)
  })
}

export default AssetsManager
