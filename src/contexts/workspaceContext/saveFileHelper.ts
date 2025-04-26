import JSZip from 'jszip'
import {VisionWorkspace} from '../fileContext/FileContext.tsx'

const saveFileHelper = (file, workspaces: VisionWorkspace[]) => {
  const zip = new JSZip()
  const assetsFolder = zip!.folder('assets')

  const newWorkspace = workspaces.map(ws => {
    return {
      ...ws,
      assets: ws.assets!.map(asset => {
        assetsFolder!.file(asset.id, asset.file)
        return asset.id
      }),
    }
  })

  const fileJson = {
    ...file,
    workspace: newWorkspace,
  }

  zip.file('file.json', JSON.stringify(fileJson))

  zip.generateAsync({
      type: 'blob', compression: 'DEFLATE',
    },
  )
    .then(function (content) {
      console.log(content)

      const a = document.createElement('a')
      const url = URL.createObjectURL(content)
      a.href = url
      a.download = file.name + '.zip'
      a.click()
      URL.revokeObjectURL(url)
    })
}
export default saveFileHelper