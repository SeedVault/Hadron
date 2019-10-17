const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./wp.common.js')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'HADRON_URL': JSON.stringify(process.env.HADRON_URL)
    })
  ],
  output: {
        publicPath: process.env.HADRON_URL || 'https://hadron.botanic.io/'
    }  
})
