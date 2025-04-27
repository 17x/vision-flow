import JSZip from 'jszip'
import {VisionFileType} from '../fileContext/FileContext.tsx'

const readFileHelper = (file: File): Promise<VisionFileType> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newZip = new JSZip()
      const loadedFile = await newZip.loadAsync(file)
      const fileJson: VisionFileType = JSON.parse(await loadedFile.files['file.json'].async('text'))

      fileJson.workspace.map(async ws => {
        const promises = ws.assets!.map(async asset => {
          const fileKey = 'assets/' + asset.id
          const fileName = asset.name
          const fileBlob = await loadedFile.files[fileKey].async('blob')

          asset.file = new File([fileBlob], fileName)

          return true
        })

        return Promise.all(promises)
      })

      resolve(fileJson)
    } catch (e) {
      reject(e)
    }
  })
}
export default readFileHelper