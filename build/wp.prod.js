const path = require('path')
const merge = require('webpack-merge');
const common = require('./wp.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
        publicPath: process.env.HADRON_URL || 'https://hadron.botanic.io/'
    },
  
});
