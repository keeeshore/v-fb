var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

console.log('loaded webpack COMMON scripts...');

module.exports = {
    
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'main': ['./src/Main.ts'],
        /*'admin': ['./src/Admin.ts']*/
    },

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['ts-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src'),
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.css$/,
                include: helpers.root('src'),
                loader: 'raw'
            },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
        ]
    },

    plugins: [
        
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        }),

        /*new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            excludeChunks: ['admin']
        }),

        new HtmlWebpackPlugin({  
          filename: 'admin/index.html',
          template: 'src/app/admin/index.html',
          excludeChunks: ['main']
        }),*/

        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        })        

    ]
};
