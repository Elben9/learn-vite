// 通过import方法可以在cjs中加载es模块
// 文件名后缀需要时mjs

async function func () {
  const b = await import('./moduleB.mjs')
  b.methodB()
}

func()

module.exports = {
  func
}
