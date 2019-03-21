module.exports = {
  add: (a, b) => {
    return a + b
  },
  test: (a) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(a+1)
      }, 1000)
    })
  }
}