import nid from '@editor/lib/nid.ts'
import {AssetsObj} from '@editor/engine/assetsManager/AssetsManager.ts'

const readImageHelper = (file: File): Promise<AssetsObj> => {
  return new Promise<AssetsObj>(async (resolve, reject) => {
    try {
      let mimeType = file.type

      resolve({
        id: nid(),
        type: 'image',
        file,
        mimeType,
        imageRef: await waitImageSize(file),
        name: file.name,
      })
    } catch (error) {
      reject(error)
    }
  })
}

export async function waitImageSize(file: File) {
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

export default readImageHelper