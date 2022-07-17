module.exports = () => ({
  name: 'esbuild:http',
  setup (build) {
    let https = require('https')
    let http = require('http')
    // 拦截CDN请求node
    build.onResolve({ filter: /^https?:\/\// }, async (args) => ({
      path: args.path,
      namespace: 'http-url'
    }))
    // 拦截间接依赖的路径，并重写路径
    // tip: 间接依赖同样会被自动带上 `http-url`的 namespace
    build.onResolve({ filter: /.*/, namespace: "http-url" }, (args) => ({
      // 重写路径
      path: new URL(args.path, args.importer).toString(),
      namespace: "http-url",
    }))
    // 通过fetch请求加载CDN资源
    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
      let contents = await new Promise((resolve, reject) => {
        function fetch (url) {
          console.log('Downloading', url)
          let lib = url.startsWith('https') ? https : http
          let req = lib.get(url, res => {
            if ([301, 302, 307].includes(res.statusCode)) {
              // 重定向
              fetch(new URL(res.headers.location, url).toString())
              req.abort()
            } else if (res.statusCode === 200) {
              let chunks = []
              res.on('data', chunk => chunks.push(chunk))
              res.on('end', () => resolve(Buffer.concat(chunks)))
            } else {
              reject(
                new Error(`Get ${url} failed: statusCode ${res.statusCode}`)
              )
            }
          }).on('error', reject)
        }
        fetch(args.path)
      })
      return { contents }
    })
    build.onEnd(buildResult => {
      if (buildResult.errors.length) {
        return;
      }
      // 构建元信息
      // 获取元信息后做一些自定义的事情，比如生成 HTML
      console.log(buildResult.metafile)
    }
    )
  }
})
