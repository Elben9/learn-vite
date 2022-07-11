# 为什么说Vite是提倡no-bundle的构建工具？

利用浏览器原生的ES模块的支持，实现开发阶段的Dev Server，进行模块的按需加载，而不是整体打包再加载，相比webpack传统的打包再加载构建模式，Vite在
开发阶段省略了耗时且繁琐的打包过程

# 为什么需要对第三方依赖预构建？

1.Vite是基于浏览器原生的ES模块规范实现的Dev Server，所以需要符合ESM规范才能正常运行，但是有很多第三方包并没有ESM的产物（如react），这种CJS的代
码无法直接在Vite中运行，需要将其转化为ESM格式
2.解决请求瀑布了的问题，如lodash-es在使用debounce时，会依赖很多工具函数，*每个import都会触发一次文件请求*，所以在依赖层级深，涉及模块多的情况下
会触发很多的网络请求，chrome限制6个并发，会导致页面加载变慢。在预构建后，lodash-es会被打包成一个文件，请求数减少，页面加载变快。

# 依赖预构建主要做了哪两件事情？

CJS转ESM；打包第三方库，减少HTTP请求

# Vite中如何开启预构建？

自动预构建；缓存在node_module/.vite

# Vite将预构建产物存放在哪里？如何利用浏览器缓存以及本地缓存？

Vite的Dev Serve会设置强缓存 Cache-Control: max-age=31536000,immutable
本地：缓存在node_module/.vite


# 有时不希望使用本地缓存的文件，如何来清除缓存和手动开启预构建？

手动删除；npx vite --force或npx vite optimize；Vite配置文件中，将server.force设为true

(Vite 项目的启动可以分为两步，第一步是依赖预构建，第二步才是 Dev Server 的启动，npx vite optimize相比于其它的方案，仅仅完成第一步的功能)

# Vite提供了哪些配置项来定制预构建过程，请简要说明？

optimizeDeps: {
  <!-- 指定预构建的入口 -->
  entries: []
  <!-- 指定要预构建的依赖（防止动态引入分析不到） -->
  includes: []
}

# 哪些场景需要配置include呢？

动态引入(无法在构建阶段被扫描出来)

# 第三方包出现问题怎么办？

使用Esbuild插件修改指定模块内容
// 插件加入 Vite 预构建配置

optimizeDeps: {
  esbuildOptions: {
    plugins: [esbuildPatchPlugin]
  }
}
