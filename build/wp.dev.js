const path = require('path')
const merge = require('webpack-merge');
const common = require('./wp.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist')
  },

  plugins: [
      new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: 'build/loaders/' + (process.env.HADRON_DEV_HTML_LOADER || 'dev.loader.html'),
      favicon: 'src/assets/images/logo.png',
      inject: true,
      chunks: ['launcher'],
      templateParameters: { 
          bbotUrl: process.env.BBOT_URL || 'http://localhost:5000/restful_channel', 
          bbotId: process.env.BBOT_ID
      }      
    }),    
  ]
});