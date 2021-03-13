export function getDebouncer (timeout: number) {
  let timeouter = 0
  return (fn: Function) => {
    window.clearTimeout(timeouter)
    timeouter = window.setTimeout(fn, timeout)
  }
}
