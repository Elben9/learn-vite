const { build } = require('esbuild')
const httpImport = require('./plugins/http-import-plugin.js')
const html = require("./plugins/html-plugin")

async function runBuild () {
  build({
    absWorkingDir: process.cwd(),
    entryPoints: ['./src/testPlugin.jsx'],
    outdir: 'dist',
    bundle: true,
    format: 'esm',
    splitting: true,
    sourcemap: true,
    metafile: true,
    plugins: [httpImport(), html()],
  }).then(() => {
    console.log('build finished!')
  })
}

runBuild()
