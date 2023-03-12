const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: '../dist',
  css: {
    extract: {
      filename: 'main.css'
    }, 
  },
  configureWebpack: {
    output: {
      filename: 'main.js',
    },
    optimization: {
      splitChunks: false, 
    },
  },
})
