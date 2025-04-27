import JSZip from 'jszip'
import {VisionFileType} from '../fileContext/FileContext.tsx'
// import {VisionWorkspace} from '../fileContext/FileContext.tsx'

const readFileHelper = (file: File) => {
  return new Promise(async (resolve, reject) => {
    const newZip = new JSZip()
    const loadedFile = await newZip.loadAsync(file)
    const fileJson: VisionFileType = JSON.parse(await loadedFile.files['file.json'].async('text'))

    fileJson.workspace.map(async ws => {
      // console.log(ws.assets)
      // assets.push(...ws.assets!)
      const promises = ws.assets!.map(async asset => {
        const fileKey = 'assets/' + asset.id
        const fileName = asset.name
        const fileBlob = await loadedFile.files[fileKey].async('blob')

        asset.file = new File([fileBlob], fileName)

        return true
      })

      return Promise.all(promises)
    })

    console.log(fileJson)
    // console.log(assets)
    // console.log(fileJson.workspace)
    // console.log(loadedFile.files['assets/'])

    resolve(fileJson)
  })
}
export default readFileHelper