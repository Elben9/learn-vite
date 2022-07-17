# 如何写一个esbuild插件

Esbuild插件结构被设计为一个对象，里面有name和setup属性，name为插件的名称，setup是一个函数，其中一个入参时build对象，这个对象
上挂载了一些钩子可以供我们自定义一些逻辑

build有四个钩子，onResolve，onload，onStart，onEnd

onResolve 和 onload是两个非常重要的钩子，分别控制路径解析和模块内容加载的过程；这两个钩子都接受两个参数Options 和 Callback
```ts
build.onResolve({ filter: /^env$/ }, args => ({
  path: args.path,
  namespace: 'env-ns',
}));
build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
  contents: JSON.stringify(process.env),
  loader: 'json',
}))
// filter过滤出文件
// namespace 为选填参数，一般在 onResolve 钩子中的回调参数返回namespace属性作为标识，我们可以在onLoad钩子中通过 namespace 将模块过滤出来。如上述插件示例就在onLoad钩子通过env-ns这个 namespace 标识过滤出了要处理的env模块。
interface Options {
  filter: RegExp;
  namespace?: string;
}
```

```ts
build.onResolve({ filter: /^env$/ }, (args: onResolveArgs): onResolveResult => {
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
    // 错误信息
    errors: [],
    // 是否需要 external
    external: false;
    // namespace 标识
    namespace: 'env-ns';
    // 模块路径
    path: args.path,
    // 额外绑定的插件数据
    pluginData: null,
    // 插件名称
    pluginName: 'xxx',
    // 设置为 false，如果模块没有被用到，模块代码将会在产物中会删除。否则不会这么做
    sideEffects: false,
    // 添加一些路径后缀，如`?xxx`
    suffix: '?xxx',
    // 警告信息
    warnings: [],
    // 仅仅在 Esbuild 开启 watch 模式下生效
    // 告诉 Esbuild 需要额外监听哪些文件/目录的变化
    watchDirs: [],
    watchFiles: []
  }
}
build.onLoad({ filter: /.*/, namespace: 'env-ns' }, (args: OnLoadArgs): OnLoadResult => {
  // 模块路径
  console.log(args.path);
  // namespace 标识
  console.log(args.namespace);
  // 后缀信息
  console.log(args.suffix);
  // 额外的插件数据
  console.log(args.pluginData);
  
  return {
    // 模块具体内容
    contents: '省略内容',
    // 错误信息
    errors: [],
    // 指定 loader，如`js`、`ts`、`jsx`、`tsx`、`json`等等
    loader: 'json',
    // 额外的插件数据
    pluginData: null,
    // 插件名称
    pluginName: 'xxx',
    // 基准路径
    resolveDir: './dir',
    // 警告信息
    warnings: [],
    // 同上
    watchDirs: [],
    watchFiles: []
  }
}
// onStart 的执行时机是在每次 build 的时候，包括触发 watch 或者 serve模式下的重新构建。
// onEnd 钩子中如果要拿到 metafile，必须将 Esbuild 的构建配置中metafile属性设为 true。
build.onStart(() => {
  console.log('build started')
})
build.onEnd((buildResult) => {
  if (buildResult.errors.length) {
    return;
  }
  // 构建元信息
  // 获取元信息后做一些自定义的事情，比如生成 HTML
  console.log(buildResult.metafile)
})
```
