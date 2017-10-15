var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

console.log('calling PROD scripts...ENV=', ENV);

module.exports = webpackMerge(commonConfig, {

  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  htmlLoader: {
    minimize: false // workaround for ng2
  },

  plugins: [
    
    new webpack.NoErrorsPlugin(),

    new webpack.optimize.DedupePlugin(),

    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),

    new ExtractTextPlugin('[name].[hash].css'),

    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
    
    new CopyWebpackPlugin([{ 
          from: helpers.root('api'),
          to:  helpers.root('dist/api'),
          ignore: [ '*.jpg' ],
          copyUnmodified: true
        }
    ])
  ]
});