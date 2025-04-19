import {FC, memo, useEffect, useRef, useState} from 'react'

export const Print: FC<{
  onClose: VoidFunction,
  editorRef: { current: Editor | null }
}> = ({
        onClose,
        editorRef,
      }) => {
  const printPreviewCanvas = useRef<HTMLCanvasElement>(null)
  const [dpr, setDpr] = useState(2)

  useEffect(() => {
    createPreview()
  }, [editorRef])

  const createPreview = () => {
    if (!editorRef || !editorRef.current || !printPreviewCanvas) {
      // console.log(editorRef.current)
      return
    }
    const {frame} = editorRef.current!.viewport
    const rect = frame.getBoundingRect()
    const destCanvas = printPreviewCanvas.current
    const destCtx = destCanvas!.getContext('2d')

    destCanvas!.width = rect.width * dpr
    destCanvas!.height = rect.height * dpr

    destCtx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    editorRef.current.printOut(destCtx)

    const close: EventListenerOrEventListenerObject = (e) => {
      onClose()
      e.preventDefault()
      e.stopPropagation()
      window.removeEventListener('keydown', close, {capture: true})
    }

    window.addEventListener('keydown', close, {capture: true})

    return () => {
      window.removeEventListener('keydown', close, {capture: true})
    }
  }

  return <div className={'fixed top-0 left-0 w-full h-full z-100 flex items-center justify-center'}>
    <div className={'absolute top-0 left-0 w-full h-full bg-gray-400 opacity-70'} onClick={onClose}></div>
    <div className={'flex w-[90%] h-[90%] bg-white rounded z-10 px-2 py-4'}>
      <div className={'w-[50%] flex items-center justify-center overflow-hidden'}>
        <canvas ref={printPreviewCanvas} className={'max-w-full max-h-full border'}></canvas>
      </div>
      <div className={'w-[50%] flex flex-col justify-between'}>
        <div></div>
        <div className={'w-full flex items-end'}>
          <button type={'button'} className={'border cursor-pointer'}
                  onClick={() => {
                    const printWindow = window.open('', '', 'width=600,height=600')
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')

                    canvas.style.size = 'a4'
                    canvas.width = printPreviewCanvas.current!.width
                    canvas.height = printPreviewCanvas.current!.height
                    ctx!.drawImage(printPreviewCanvas.current!, 0, 0)

                    printWindow.document.body.append(canvas)
                    printWindow.document.close()
                    printWindow.focus()
                    printWindow.print()
                    printWindow.close()
                  }
                  }>Print
          </button>
        </div>
      </div>
    </div>
  </div>
}