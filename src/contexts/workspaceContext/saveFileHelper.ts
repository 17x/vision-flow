import JSZip from 'jszip'
import {VisionWorkspace} from '../fileContext/FileContext.tsx'

const saveFileHelper = (file, workspace: VisionWorkspace[]) => {
  const zip = new JSZip()
  const newWorkspace = workspace.map(item => {
    const currentWSFolder = zip.folder(item.id)
    console.log(item.assets)
    item.assets.forEach(asset => {
      zip.file(asset.src, asset.imageRef)
    })
  })
  const fileJson = {
    ...file,
    workspace: newWorkspace,
  }
  console.log(file)
  console.log('saveFileHelper', workspace)

  zip.file('file.json', JSON.stringify(fileJson))
  zip.folder('workspaces')
  // var img = zip.folder('images')
  /*workspace.map(item => {
    console.log(item)
    newWorkspace.push({
      id: item.id,
      name: item.name,
      data: item.data,
    })
  })*/
  // img.file('smile.gif', imgData, {base64: true})
  zip.generateAsync({type: 'blob'})
    .then(function (content) {
      // see FileSaver.js
      console.log(content)
      // saveAs(content, 'example.zip')
      const a = document.createElement('a')
      const url = URL.createObjectURL(content)
      a.href = url
      // a.download = file.name + '.vz'
      a.download = file.name + '.zip'
      a.click()
      URL.revokeObjectURL(url)
    })
}
export default saveFileHelper