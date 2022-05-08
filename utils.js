
const debounce = (callback, delay) => {
  let timeoutID
  return (...args) => {
    if (timeoutID) clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {
      callback.apply(null, args)
    }, delay)
  }
}