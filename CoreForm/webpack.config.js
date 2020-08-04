'use strict';

const { VueLoaderPlugin } = require('vue-loader');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: { main: './src/main.js' },
    output: {
        path: __dirname + '/wwwroot/dist',
        publicPath: '/dist/'
    },
    resolve: {
        modules: ['src', 'node_modules'],
        alias: { vue$: 'vue/dist/vue.esm.js' }
    },
    module: {
        rules: [
            {
                test: /\.vue$/, use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyPlugin(
            [
                { from: './src/assets', to: './assets' }
            ],
        ),

    ]
};