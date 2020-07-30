const path = require('path');
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const {
  NODE_ENV,
  PUBLIC_PATH
} = process.env;
const isProduction = NODE_ENV === 'production';

module.exports = {
  publicPath: PUBLIC_PATH,
  devServer: {
    port: 6008,
    disableHostCheck: true,
    public: '0.0.0.0',
  },
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      css: {
        modules: {
          localIdentName: isProduction ? '[hash:base64:10]' : '[name]-[local]_[hash:base64:5]',
        },
      },
      less: {
        modifyVars: {
          'primary-color': '#EB4F4B',
          'border-color-base': '#E5E5E5',
          'text-color': '#1F1E30',
          'heading-color': '#1F1E30',
          'label-color': '#1F1E30',
          'border-radius-base': '2px',
          'input-placeholder-color': '#A1A1A8',
          'table-header-bg': '#E4E4E6'
        },
        javascriptEnabled: true,
      }
    }
  },

  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)));
  },

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
      }
    },
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: require('./public/vendor/vendor-manifest.json')
      }),
      new AddAssetHtmlPlugin({
        filepath: path.resolve(__dirname, './public/vendor/*.dll.js')
      })
    ]
  },
};

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/style/abstract/*.styl'),
      ],
    });
}