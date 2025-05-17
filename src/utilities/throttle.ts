function throttle<T extends (...args: unknown[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>): void => {
    const now = Date.now()

    const invoke = () => {
      lastCall = now
      func(...args)
    }

    if (now - lastCall >= delay) {
      invoke()
    } else {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(invoke, delay - (now - lastCall))
    }
  }
}

export default throttle