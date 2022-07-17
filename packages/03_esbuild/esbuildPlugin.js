let envPlugin = {
  name: 'env',
  setup (build) {
    build.onResolve({ filter: /^env$/ }, args => {
      // 模块路径
      console.log(args.path)
      // 父模块路径
      console.log(args.importer)
      // namespace 标识
      console.log(args.namespace)
      // 基准路径
      console.log(args.resolveDir)
      // 导入方式，如 import、require
      console.log(args.kind)
      // 额外绑定的插件数据
      console.log(args.pluginData)
      return {
        path: args.path,
        namespace: 'env-ns',
      }
    })
    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
      contents: JSON.stringify(process.env),
      loader: 'json',
    }))
  }
}

require('esbuild').build({
  entryPoints: ['./src/esbuildPlugin.js'],
  bundle: true,
  outdir: "dist",
  // 应用插件
  plugins: [envPlugin],
}).catch(() => process.exit(1))
