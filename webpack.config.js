const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/scripts/index.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
	rules: [{
	  test: /.jsx?$/,
	  include: [
			path.resolve(__dirname, 'src')
	  ],
	  exclude: [
			path.resolve(__dirname, 'node_modules'),
	  ],
	  loader: 'babel-loader',
	  query: {
		presets: ['es2015']
	  }
	}]
  },
  resolve: {
		extensions: ['.json', '.js', '.jsx', '.css'],
		alias: {
				'framework': path.join(__dirname, './src/scripts/framework'),
				'app': path.join(__dirname, './src/scripts/app'),
				'game': path.join(__dirname, './src/scripts/game'),
				'PIXI'      : path.join(__dirname, './node_modules/pixi.js'),
		}
  },
  devtool: 'source-map',
  devServer: {
		publicPath: path.join('/dist/')
  }
};



// const path = require('path');

// module.exports = {
// 	mode: 'development',
		
// 	entry: './src/scripts/main.js',

// 	output: {
// 		filename: 'bundle.js',
// 		path: path.resolve(__dirname, 'dist')
// 	},

// 	module: {
// 		loaders: [
// 			{
// 				test: /\.js$/,
// 				exclude: /(node_modules)/,
// 				loader: 'babel-loader',
// 				query: {
// 					presets: ['es2015']
// 				}
// 			}
// 		]
// 	}
// };