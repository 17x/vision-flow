const coordinator = (srcCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement) => {
  targetCanvas.width = srcCanvas.width
  targetCanvas.height = srcCanvas.height
  targetCanvas.style.width = srcCanvas.clientWidth + 'px'
  targetCanvas.style.height = srcCanvas.clientHeight + 'px'
  targetCanvas.style.top = srcCanvas.offsetTop + 'px'
  targetCanvas.style.left = srcCanvas.offsetLeft + 'px'
}

export default coordinator