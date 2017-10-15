var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

console.log('calling DEV scripts..ENV = ', ENV, '  process.env.ENV ',  process.env.ENV);

module.exports = webpackMerge(commonConfig, {

    devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [

        new ExtractTextPlugin('[name].css'),

        new webpack.DefinePlugin({
            'process.env': { 'ENV': JSON.stringify(ENV) }
        })

    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }

});