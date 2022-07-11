import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 如果类型报错，需要安装 @types/node: pnpm i @types/node -D
// tsconfig.node.json 中  allowSyntheticDefaultImports改为true
import path from 'path'
import { normalizePath } from 'vite'
// 适配各种浏览器，增加前缀
import autoprefixer from 'autoprefixer'
// react中引入svg
import svgr from 'vite-plugin-svgr'

// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve(__dirname, './src/variable.scss'))
const isProduction = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  // 手动置顶项目根目录位置,(需要将index.html在根目录下)
  // root: path.join(__dirname, 'src'),

  // 打包后会加到资源前 静态资源地址自动增加前缀
  // base: isProduction ? '/www.alltuu.com/' : '/',
  plugins: [react(), svgr()],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData 的内容会在每个 scss 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    },
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: "[name]__[local]___[hash:base64:5]"
    },
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['Chrome > 40', 'ff > 31']
        })
      ]
    }
  },
  resolve: {
    alias: {
      '@assets': path.join(__dirname, 'src/assets')
    }
  },
  build: {
    // 8 KB 以下 则行内， 以上，则单独打包
    assetsInlineLimit: 8 * 1024
  },
  optimizeDeps: {
    // 预构建
    // entries: ['./src/main.tsx']
    // 强制预构建 
    // 适用场景：动态import 动态 import 的路径只有运行时才能确定，无法在预构建阶段被扫描出来
    include: ['lodash-es']
  }
})

// 特殊资源后缀
// Vite 中引入静态资源时，也支持在路径最后加上一些特殊的 query 后缀，包括:

// ?url: 表示获取资源的路径，这在只想获取文件路径而不是内容的场景将会很有用。
// ?raw: 表示获取资源的字符串内容，如果你只想拿到资源的原始内容，可以使用这个后缀。
// ?inline: 表示资源强制内联，而不是打包成单独的文件。

