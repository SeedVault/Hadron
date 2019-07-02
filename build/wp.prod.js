const path = require('path')
const merge = require('webpack-merge');
const common = require('./wp.common.js');

module.exports = merge(common, {
  mode: 'production',
  
});