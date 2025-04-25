export interface AssetsObj {
  type: 'image' | 'svg' | 'font'
  src: string
  loaded?: boolean
  imageRef?: HTMLImageElement
}

class AssetsMaganer {
  assetsMap: Map<string, AssetsObj> = new Map()

  constructor(props: AssetsObj[] = [], callback?: (objs: AssetsObj[]) => void) {
    if (props.length === 0) return
    const pArr = props.map(({type, src}) => {
      return this.add(type, src)
    })

    Promise.all(pArr).then((objs: AssetsObj[]) => objs).finally((objs) => callback(objs))
  }

  getAssetsObj(src: string): AssetsObj | false {
    return this.assetsMap.get(src) || false
  }

  async add(type: AssetsObj['type'], src: string): Promise<AssetsObj> {
    const obj = {
      type,
      src,
      loaded: false,
    }

    this.assetsMap.set(src, obj)

    return this.load(obj)
  }

  async load(obj: AssetsObj): Promise<AssetsObj> {

    return new Promise(async (resolve, reject) => {
      if (obj.type === 'image') {
        const imageRef = new Image()

        imageRef.onload = () => {
          obj.loaded = true
          obj.imageRef = imageRef
          resolve(obj)
        }

        imageRef.onerror = () => {
          obj.loaded = true
          reject('Asset error')
        }

        imageRef.src = obj.src
      }
    })
  }

  destory() {
    this.assetsMap.forEach((asset) => {
      // do sth
    })
  }
}

export default AssetsMaganer
