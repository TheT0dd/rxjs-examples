const webpack = require('webpack');

module.exports = {
	entry: {
		app: './examples/index.js',
	},
	output: {
		path: './dist',
		filename: '[name].js'
	},
	module: {
		loaders: [
			{
				exclude: '/node_modules/',
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	devtool: 'inline-source-map',
	devServer: {
		// Unlike the cli flag, this doesn't set
		// HotModuleReplacementPlugin!
		hot: true,
		inline: true,

		stats: {
			chunks: false, // Makes the build much quieter
			colors: true
		},

		host: process.env.HOST, // Defaults to `localhost`
		port: process.env.PORT || 8000 // Defaults to 8000
	},
	plugins: [
		// Enable multi-pass compilation for enhanced performance
		// in larger projects. Good default.
		new webpack.HotModuleReplacementPlugin({multiStep: true})
	]
};
