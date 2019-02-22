 /*jshint esversion: 6 */

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const hadronLocal = {
	mode: 'development',
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
			}
		]
	},
	output: {
		/* Set the output to the right name for what we are building */
		path: path.resolve(__dirname, 'builds/local'),
		filename: '[name].js'
	},
	plugins: [
			new CopyWebpackPlugin([
				{from: './src/javascript/threejs/three.js',         	to: 'three.js'},
				{from: './src/javascript/threejs/stats.min.js',       to: 'stats.min.js'},
				{from: './src/javascript/threejs/dat.gui.min.js',    	to: 'dat.gui.min.js'},

				{from: './src/javascript/threejs/Detector.js',      	to: 'Detector.js'},
				{from: './src/javascript/threejs/GLTFLoader.js',    	to: 'GLTFLoader.js'},
				{from: './src/javascript/threejs/FBXLoader.js',      	to: 'FBXLoader.js'},
				{from: './src/javascript/threejs/inflate.min.js',    	to: 'inflate.min.js'},
				{from: './src/javascript/threejs/OrbitControls.js', 	to: 'OrbitControls.js'},
				{from: './src/javascript/threejs/OutlineEffect.js', 	to: 'OutlineEffect.js'},
				{from: './src/javascript/threejs/OutlinePass.js',    	to: 'OutlinePass.js'},

				{from: './src/javascript/threejs/CurveExtras.js',    	to: 'CurveExtras.js'},

				{from: './src/javascript/threejs/SobelOperatorShader.js', to: 'SobelOperatorShader.js'},

				{from: './src/javascript/threejs/CopyShader.js',    	to: 'CopyShader.js'},
				{from: './src/javascript/threejs/ToonShader.js', 	    to: 'ToonShader.js'},
				{from: './src/javascript/threejs/MaskPass.js', 	      to: 'MaskPass.js'},
				{from: './src/javascript/threejs/GlitchPass.js', 	    to: 'GlitchPass.js'},
				{from: './src/javascript/threejs/ShaderToon.js', 	    to: 'ShaderToon.js'},
				{from: './src/javascript/threejs/VignetteShader.js', 	to: 'VignetteShader.js'},
				{from: './src/javascript/threejs/FXAAShader.js', 	    to: 'FXAAShader.js'},
				{from: './src/javascript/threejs/ShaderPass.js',      to: 'ShaderPass.js'},
				{from: './src/javascript/threejs/EffectComposer.js',  to: 'EffectComposer.js'},
				{from: './src/javascript/threejs/RenderPass.js',      to: 'RenderPass.js'},
				{from: './src/javascript/threejs/DigitalGlitch.js',   to: 'DigitalGlitch.js'},

				{from: './src/javascript/threejs/HalftoneShader.js',  to: 'HalftoneShader.js'},
				{from: './src/javascript/threejs/HalftonePass.js',    to: 'HalftonePass.js'},

				{from: './src/javascript/threejs/SepiaShader.js',     to: 'SepiaShader.js'},

				{from: './src/javascript/threejs/DotScreenPass.js',   to: 'DotScreenPass.js'},
				{from: './src/javascript/threejs/DotScreenShader.js', to: 'DotScreenShader.js'},
				{from: './noship/html/avatar.html',                   to: 'avatar.html'},
				{from: './noship/html/avatar_local.html',             to: 'avatar_local.html'},
				{from: './src/resources/500-milliseconds-of-silence.mp3', to: '500-milliseconds-of-silence.mp3'},
				{from: './src/hadron.php',       					         		to: 'hadron.php'}
			]),
			/* Define the build vars here so we can remove the config. */
			new webpack.DefinePlugin({
				"Configalso_known_as": JSON.stringify("local"),
				"Configall_your_bases_are_belong_to_us": JSON.stringify("./"),
				"Configmtone_base_uri": JSON.stringify("BASEPATH/api/v41/"),
				"Configauthor_tool_domain": JSON.stringify("https://system.botanic.io"),
				"Configapi_key": JSON.stringify("APIKEY")
			})
	],
	performance: {
		hints: false
	}
};


const hadronDevelopers = {
	mode: 'development',
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
			}
		]
	},
	output: {
		/* Set the output to the right name for what we are building */
		path: path.resolve(__dirname, 'builds/developers'),
		filename: '[name].js'
	},
	plugins: [
			new CopyWebpackPlugin([
				{from: './src/javascript/threejs/three.js',         	to: 'three.js'},
				{from: './src/javascript/threejs/stats.min.js',       to: 'stats.min.js'},
				{from: './src/javascript/threejs/dat.gui.min.js',    	to: 'dat.gui.min.js'},

				{from: './src/javascript/threejs/Detector.js',      	to: 'Detector.js'},
				{from: './src/javascript/threejs/GLTFLoader.js',    	to: 'GLTFLoader.js'},
				{from: './src/javascript/threejs/FBXLoader.js',      	to: 'FBXLoader.js'},
				{from: './src/javascript/threejs/inflate.min.js',    	to: 'inflate.min.js'},
				{from: './src/javascript/threejs/OrbitControls.js', 	to: 'OrbitControls.js'},
				{from: './src/javascript/threejs/OutlineEffect.js', 	to: 'OutlineEffect.js'},
				{from: './src/javascript/threejs/OutlinePass.js',    	to: 'OutlinePass.js'},

				{from: './src/javascript/threejs/SobelOperatorShader.js', to: 'SobelOperatorShader.js'},

				{from: './src/javascript/threejs/CopyShader.js',    	to: 'CopyShader.js'},
				{from: './src/javascript/threejs/ToonShader.js', 	    to: 'ToonShader.js'},
				{from: './src/javascript/threejs/MaskPass.js', 	      to: 'MaskPass.js'},
				{from: './src/javascript/threejs/GlitchPass.js', 	    to: 'GlitchPass.js'},
				{from: './src/javascript/threejs/ShaderToon.js', 	    to: 'ShaderToon.js'},
				{from: './src/javascript/threejs/VignetteShader.js', 	to: 'VignetteShader.js'},
				{from: './src/javascript/threejs/FXAAShader.js', 	    to: 'FXAAShader.js'},
				{from: './src/javascript/threejs/ShaderPass.js',      to: 'ShaderPass.js'},
				{from: './src/javascript/threejs/EffectComposer.js',  to: 'EffectComposer.js'},
				{from: './src/javascript/threejs/RenderPass.js',      to: 'RenderPass.js'},
				{from: './src/javascript/threejs/DigitalGlitch.js',   to: 'DigitalGlitch.js'},

				{from: './src/javascript/threejs/HalftoneShader.js',  to: 'HalftoneShader.js'},
				{from: './src/javascript/threejs/HalftonePass.js',    to: 'HalftonePass.js'},

				{from: './src/javascript/threejs/SepiaShader.js',     to: 'SepiaShader.js'},

				{from: './src/javascript/threejs/DotScreenPass.js',   to: 'DotScreenPass.js'},
				{from: './src/javascript/threejs/DotScreenShader.js', to: 'DotScreenShader.js'},
				{from: './noship/html/avatar.html',                   to: 'avatar.html'},
				{from: './noship/html/avatar_local.html',             to: 'avatar_local.html'},
				{from: './src/resources/500-milliseconds-of-silence.mp3', to: '500-milliseconds-of-silence.mp3'},
				{from: './src/hadron.php',       					         		to: 'hadron.php'}
			]),
			/* Define the build vars here so we can remove the config. */
			new webpack.DefinePlugin({
				"Configalso_known_as": JSON.stringify("beta"),
				"Configall_your_bases_are_belong_to_us": JSON.stringify("https://hadron.botanic.io/developers/"),
				"Configmtone_base_uri": JSON.stringify("BASEPATH/api/v41/"),
				"Configauthor_tool_domain": JSON.stringify("https://system.botanic.io"),
				"Configapi_key": JSON.stringify("APIKEY")
			})
	],
	performance: {
		hints: false
	}
};



const hadronBetaAvatar = {
	mode: 'development',
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
			}
		]
	},
	output: {
		/* Set the output to the right name for what we are building */
		path: path.resolve(__dirname, 'builds/beta_3d'),
		filename: '[name].js'
	},
	plugins: [
			new CopyWebpackPlugin([
				{from: './src/javascript/threejs/three.js',         	to: 'three.js'},
				{from: './src/javascript/threejs/stats.min.js',       to: 'stats.min.js'},
				{from: './src/javascript/threejs/dat.gui.min.js',    	to: 'dat.gui.min.js'},

				{from: './src/javascript/threejs/Detector.js',      	to: 'Detector.js'},
				{from: './src/javascript/threejs/GLTFLoader.js',    	to: 'GLTFLoader.js'},
				{from: './src/javascript/threejs/FBXLoader.js',      	to: 'FBXLoader.js'},
				{from: './src/javascript/threejs/inflate.min.js',    	to: 'inflate.min.js'},
				{from: './src/javascript/threejs/OrbitControls.js', 	to: 'OrbitControls.js'},
				{from: './src/javascript/threejs/OutlineEffect.js', 	to: 'OutlineEffect.js'},
				{from: './src/javascript/threejs/OutlinePass.js',    	to: 'OutlinePass.js'},

				{from: './src/javascript/threejs/SobelOperatorShader.js', to: 'SobelOperatorShader.js'},

				{from: './src/javascript/threejs/CopyShader.js',    	to: 'CopyShader.js'},
				{from: './src/javascript/threejs/ToonShader.js', 	    to: 'ToonShader.js'},
				{from: './src/javascript/threejs/MaskPass.js', 	      to: 'MaskPass.js'},
				{from: './src/javascript/threejs/GlitchPass.js', 	    to: 'GlitchPass.js'},
				{from: './src/javascript/threejs/ShaderToon.js', 	    to: 'ShaderToon.js'},
				{from: './src/javascript/threejs/VignetteShader.js', 	to: 'VignetteShader.js'},
				{from: './src/javascript/threejs/FXAAShader.js', 	    to: 'FXAAShader.js'},
				{from: './src/javascript/threejs/ShaderPass.js',      to: 'ShaderPass.js'},
				{from: './src/javascript/threejs/EffectComposer.js',  to: 'EffectComposer.js'},
				{from: './src/javascript/threejs/RenderPass.js',      to: 'RenderPass.js'},
				{from: './src/javascript/threejs/DigitalGlitch.js',   to: 'DigitalGlitch.js'},

				{from: './src/javascript/threejs/HalftoneShader.js',  to: 'HalftoneShader.js'},
				{from: './src/javascript/threejs/HalftonePass.js',    to: 'HalftonePass.js'},

				{from: './src/javascript/threejs/SepiaShader.js',     to: 'SepiaShader.js'},

				{from: './src/javascript/threejs/DotScreenPass.js',   to: 'DotScreenPass.js'},
				{from: './src/javascript/threejs/DotScreenShader.js', to: 'DotScreenShader.js'},
				{from: './noship/html/avatar.html',                   to: 'avatar.html'},
				{from: './noship/html/avatar_local.html',             to: 'avatar_local.html'},
				{from: './src/resources/500-milliseconds-of-silence.mp3', to: '500-milliseconds-of-silence.mp3'},
				{from: './src/hadron.php',       					         		to: 'hadron.php'}
			]),
			/* Define the build vars here so we can remove the config. */
			new webpack.DefinePlugin({
				"Configalso_known_as": JSON.stringify("beta"),
				"Configall_your_bases_are_belong_to_us": JSON.stringify("https://hadron.botanic.io/beta_3d/"),
				"Configmtone_base_uri": JSON.stringify("BASEPATH/api/v41/"),
				"Configauthor_tool_domain": JSON.stringify("https://system.botanic.io"),
				"Configapi_key": JSON.stringify("APIKEY")
			})
	],
	performance: {
		hints: false
	}
};


const hadronAvatar = {
	mode: 'development',
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
			}
		]
	},
	output: {
		/* Set the output to the right name for what we are building */
		path: path.resolve(__dirname, 'builds/dist_3d'),
		filename: '[name].js'
	},
	plugins: [
			new CopyWebpackPlugin([
				{from: './src/javascript/threejs/three.js',         	to: 'three.js'},
				{from: './src/javascript/threejs/stats.min.js',       to: 'stats.min.js'},
				{from: './src/javascript/threejs/dat.gui.min.js',    	to: 'dat.gui.min.js'},

				{from: './src/javascript/threejs/Detector.js',      	to: 'Detector.js'},
				{from: './src/javascript/threejs/GLTFLoader.js',    	to: 'GLTFLoader.js'},
				{from: './src/javascript/threejs/FBXLoader.js',      	to: 'FBXLoader.js'},
				{from: './src/javascript/threejs/inflate.min.js',    	to: 'inflate.min.js'},
				{from: './src/javascript/threejs/OrbitControls.js', 	to: 'OrbitControls.js'},
				{from: './src/javascript/threejs/OutlineEffect.js', 	to: 'OutlineEffect.js'},
				{from: './src/javascript/threejs/OutlinePass.js',    	to: 'OutlinePass.js'},

				{from: './src/javascript/threejs/SobelOperatorShader.js', to: 'SobelOperatorShader.js'},

				{from: './src/javascript/threejs/CopyShader.js',    	to: 'CopyShader.js'},
				{from: './src/javascript/threejs/ToonShader.js', 	    to: 'ToonShader.js'},
				{from: './src/javascript/threejs/MaskPass.js', 	      to: 'MaskPass.js'},
				{from: './src/javascript/threejs/GlitchPass.js', 	    to: 'GlitchPass.js'},
				{from: './src/javascript/threejs/ShaderToon.js', 	    to: 'ShaderToon.js'},
				{from: './src/javascript/threejs/VignetteShader.js', 	to: 'VignetteShader.js'},
				{from: './src/javascript/threejs/FXAAShader.js', 	    to: 'FXAAShader.js'},
				{from: './src/javascript/threejs/ShaderPass.js',      to: 'ShaderPass.js'},
				{from: './src/javascript/threejs/EffectComposer.js',  to: 'EffectComposer.js'},
				{from: './src/javascript/threejs/RenderPass.js',      to: 'RenderPass.js'},
				{from: './src/javascript/threejs/DigitalGlitch.js',   to: 'DigitalGlitch.js'},

				{from: './src/javascript/threejs/HalftoneShader.js',  to: 'HalftoneShader.js'},
				{from: './src/javascript/threejs/HalftonePass.js',    to: 'HalftonePass.js'},

				{from: './src/javascript/threejs/SepiaShader.js',     to: 'SepiaShader.js'},

				{from: './src/javascript/threejs/DotScreenPass.js',   to: 'DotScreenPass.js'},
				{from: './src/javascript/threejs/DotScreenShader.js', to: 'DotScreenShader.js'},
				{from: './noship/html/avatar.html',                   to: 'avatar.html'},
				{from: './noship/html/avatar_local.html',             to: 'avatar_local.html'},
				{from: './src/resources/500-milliseconds-of-silence.mp3', to: '500-milliseconds-of-silence.mp3'},
				{from: './src/hadron.php',       					         		to: 'hadron.php'}
			]),
			/* Define the build vars here so we can remove the config. */
			new webpack.DefinePlugin({
				"Configalso_known_as": JSON.stringify("beta"),
				"Configall_your_bases_are_belong_to_us": JSON.stringify("https://hadron.botanic.io/dist_3d/"),
				"Configmtone_base_uri": JSON.stringify("BASEPATH/api/v41/"),
				"Configauthor_tool_domain": JSON.stringify("https://system.botanic.io"),
				"Configapi_key": JSON.stringify("APIKEY")
			})
	],
	performance: {
		hints: false
	}
};


const hadronAuthorToolBeta = {
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
			}
		]
	},
	output: {
		/* Set the output to the right name for what we are building */
		path: path.resolve(__dirname, 'builds/beta_author'),
		filename: '[name].js'
	},
	plugins: [
			new CopyWebpackPlugin([
				{from: './src/resources/500-milliseconds-of-silence.mp3', to: '500-milliseconds-of-silence.mp3'},
				{from: './src/hadron.php',       					         		to: 'hadron.php'}
			]),
			/* Define the build vars here so we can remove the config. */
			new webpack.DefinePlugin({
				"Configalso_known_as": JSON.stringify("beta_author"),
				"Configall_your_bases_are_belong_to_us": JSON.stringify("https://hadron.botanic.io/beta_author/"),
				"Configmtone_base_uri": JSON.stringify("BASEPATH/api/v41/"),
				"Configauthor_tool_domain": JSON.stringify("https://system-dev.botanic.io"),
				"Configapi_key": JSON.stringify("APIKEY")
			})
	],
	performance: {
		hints: false
	}
};


const hadronAuthorToolDev = {
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
			}
		]
	},
	output: {
		/* Set the output to the right name for what we are building */
		path: path.resolve(__dirname, 'builds/dev_author'),
		filename: '[name].js'
	},
	plugins: [
			new CopyWebpackPlugin([
				{from: './src/resources/500-milliseconds-of-silence.mp3', to: '500-milliseconds-of-silence.mp3'},
				{from: './src/hadron.php',       					         		to: 'hadron.php'}
			]),
			/* Define the build vars here so we can remove the config. */
			new webpack.DefinePlugin({
				"Configalso_known_as": JSON.stringify("dev_author"),
				"Configall_your_bases_are_belong_to_us": JSON.stringify("https://hadron.botanic.io/dev_author/"),
				"Configmtone_base_uri": JSON.stringify("BASEPATH/api/v41/"),
				"Configauthor_tool_domain": JSON.stringify("https://system-dev.botanic.io"),
				"Configapi_key": JSON.stringify("APIKEY")
			})
	],
	performance: {
		hints: false
	}
};


const hadronAuthorToolProd = {
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
			}
		]
	},
	output: {
		/* Set the output to the right name for what we are building */
		path: path.resolve(__dirname, 'builds/prod_author'),
		filename: '[name].js'
	},
	plugins: [
			new CopyWebpackPlugin([
				{from: './src/resources/500-milliseconds-of-silence.mp3', to: '500-milliseconds-of-silence.mp3'},
				{from: './src/hadron.php',       					            		to: 'hadron.php'}
			]),
			/* Define the build vars here so we can remove the config. */
			new webpack.DefinePlugin({
				"Configalso_known_as": JSON.stringify("prod_author"),
				"Configall_your_bases_are_belong_to_us": JSON.stringify("https://hadron.botanic.io/prod_author/"),
				"Configmtone_base_uri": JSON.stringify("BASEPATH/api/v41/"),
				"Configauthor_tool_domain": JSON.stringify("https://system.botanic.io"),
				"Configapi_key": JSON.stringify("APIKEY")
			})
	],
	performance: {
		hints: false
	}
};


const hadronBotOne = {
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
			}
		]
	},
	output: {
		/* Set the output to the right name for what we are building */
		path: path.resolve(__dirname, 'builds/dist'),
		filename: '[name].js'
	},
	plugins: [
			new CopyWebpackPlugin([
				{from: './src/resources/500-milliseconds-of-silence.mp3', to: '500-milliseconds-of-silence.mp3'},
				{from: './src/hadron.php',       					         		to: 'hadron.php'}
			]),
			/* Define the build vars here so we can remove the config. */
			new webpack.DefinePlugin({
				"Configalso_known_as": JSON.stringify("dist"),
				"Configall_your_bases_are_belong_to_us": JSON.stringify("https://hadron.botanic.io/dist/"),
				"Configmtone_base_uri": JSON.stringify("BASEPATH/api/v41/"),
				"Configauthor_tool_domain": JSON.stringify("https://system.botanic.io"),
				"Configapi_key": JSON.stringify("APIKEY")
			})
	],
	performance: {
		hints: false
	}
};


const hadronCodePen = {
	mode: 'development',
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
			}
		]
	},
	output: {
		/* Set the output to the right name for what we are building */
		path: path.resolve(__dirname, 'builds/codepen'),
		filename: '[name].js'
	},
	plugins: [
			new CopyWebpackPlugin([
				{from: './src/resources/500-milliseconds-of-silence.mp3', to: '500-milliseconds-of-silence.mp3'},
				{from: './src/hadron.php',       					         		to: 'hadron.php'},
				{from: './noship/html/index.html',                    to: 'index.html'}
			]),
			/* Define the build vars here so we can remove the config. */
			new webpack.DefinePlugin({
				"Configalso_known_as": JSON.stringify("codepen"),
				"Configall_your_bases_are_belong_to_us": JSON.stringify("https://hadron.botanic.io/codepen/"),
				"Configmtone_base_uri": JSON.stringify("BASEPATH/api/v41/"),
				"Configauthor_tool_domain": JSON.stringify("https://system.botanic.io"),
				"Configapi_key": JSON.stringify("APIKEY")
			})
	],
	performance: {
		hints: false
	}
};

module.exports = [hadronCodePen, hadronLocal, hadronBetaAvatar, hadronDevelopers, hadronAuthorToolBeta, hadronAuthorToolDev, hadronAuthorToolProd, hadronBotOne, hadronAvatar];
