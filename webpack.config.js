const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
			hadron: './src/hadron.js',
			launcher: './src/hadron.launcher.js'
		},
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|gif|woff|woff2)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
        test: require.resolve('./src/javascript/zepto.min.js'),
        use: 'imports-loader?this=>window'
      }
		]
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	plugins: [
			new CopyWebpackPlugin([
				{from: './src/index.html',       to: 'index.html'},
				{from: './src/hadron.php',       to: 'hadron.php'}
			])
	],
	performance: {
		hints: false
	}
};
