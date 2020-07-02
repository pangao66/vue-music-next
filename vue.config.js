// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function resolve (dir) {
  return path.join(__dirname, dir)
}

const headers = {
  referer: 'https://c.y.qq.com/',
  host: 'c.y.qq.com'
}
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        components: path.resolve('src/components'),
        common: path.resolve('src/common'),
        views: path.resolve('src/views'),
        base: path.resolve('src/base'),
        api: path.resolve('src/api'),
        util: path.resolve('src/util'),
        pages: path.resolve('src/pages'),
        service: path.resolve('src/service'),
        libs: path.resolve('src/libs'),
        assets: path.resolve('src/assets')
      }
    }
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      stylus: {
        'resolve url': true,
        import: [
          path.resolve(__dirname, './src/common/stylus/mixin.styl'),
          path.resolve(__dirname, './src/common/stylus/variable.styl')
        ]
      }
    },
    sourceMap: true
  }
}
