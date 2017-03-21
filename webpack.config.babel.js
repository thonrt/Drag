const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: path.join(__dirname, 'drag'),
    output: {
        path: __dirname,
        filename: './build/bunble.js'
    },
    devServer: {
        inline: true,
        port: 8090
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            include: path.join(__dirname, 'drag'),
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [new HtmlWebpackPlugin({
            template: './drag/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};