const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    vendor: [
      'vue',
      'vue-router',
      'vuex',
      'axios',
      'ant-design-vue',
      'lodash',
      'moment'
    ]
  },
  output: {
    path: path.join(__dirname, 'public/vendor'),
    filename: '[name].dll.js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      context: process.cwd(),
      name: '[name]_[hash]',
      path: path.join(__dirname, 'public/vendor/[name]-manifest.json')
    })
  ]
}