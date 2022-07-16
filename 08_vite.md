# Vite底层使用了哪两个构建引擎？

开发环境Esbuild 生产环境Rollup

# 简要列举Esbuild在Vite的构建体系中发挥了哪些作用？

- Pre-bundle 开发阶段的依赖预构建
- 单文件编译--作为TS和JSX的编译工具
- 代码压缩 作为压缩工具

# 在开发阶段的依赖构建阶段Esbuild起到了什么作用？
# Esbuild作为打包工具存在什么缺点？

- 不支持降级es5
- 不支持 const enum等语法
- 不提供操作打包产物的接口（如Rollup中灵活处理打包产物的能力（renderCHunk钩子）在Esbuild中没有）
- 不支持自定义的code splitting，降低了拆包优化的灵活性

# Esbuild作为TS和JSX编译工具有什么优点和局限？

Vite使用

# Esbuild作为压缩工具和Terser相比效率高的原因是什么？

Terser慢的原因：
1. 压缩这项工作涉及大量的AST操作，在传统构建中，AST在各个工具间无法共享，造成了很多的重复解析过程
2. Js本身时解释性 + JIT（即时编译）的语言，对于压缩这种GPU密集型的工作，其性能比不上Golang这种原生语言

因此，Esbuild 这种从头到尾共享 AST 以及原生语言编写的 Minifier 在性能上能够甩开传统工具的好几十倍。

# Rollup在vite中都扮演什么角色？

生产环境打包工具

# Vite在生产环境中，对Rollup的打包能力进行了哪些扩展优化？

- css代码分割
- 自动预加载
- 异步chunk加载优化

# Vite如何做到兼容Rollup插件写法的？