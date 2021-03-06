const path = require('path');
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        launcher: './src/hadron.launcher.js',
        hadron: './src/hadron.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',                
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',                
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',                
            },
            {
            test: /\.css$/,
            loaders: [
                'style-loader',
                'css-loader',
                ]
            },
            {
                loader: "webpack-modernizr-loader",
                test: /\.modernizrrc\.js$/
                // Uncomment this when you use `JSON` format for configuration
                // type: 'javascript/auto'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {            
            '@': resolve('src'),
            modernizr$: path.resolve(__dirname, "../.modernizrrc.js")
        }
    },
    plugins: [      
        // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'            
            }),
            //@TODO this shouldn't be needed. FIX
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, '../src/assets'),
                    to: 'assets',
                    ignore: ['.*']
                }
            ]),
            new HtmlWebpackPlugin({
                filename: path.resolve(__dirname, '../dist/hadron.app.html'),
                template: 'build/hadron.app.html',                        
                chunks: ['hadron']
                }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),        
    },
    node: {
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
};