require('./check-versions');

const webpack = require('webpack');
const merge = require('webpack-merge');
const utils = require('./utils');
const config = require('../config');
const webpackConfig = require('./webpack.base.conf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
//图片压缩
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const prodWebpackConfig = merge(webpackConfig, {
    mode: 'production',
    performance: {
        hints: false
    },
    output: {
        publicPath: utils.publicPath('production')
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('styles/[name].[hash:8].css')
        }),
        new ImageminPlugin({
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            minFileSize: 10000, //超过10k压缩
            pngquant: {
                quality: '95-100'
            }
        })
    ],
    optimization: {
        minimize: true, //pro模式默认值
        flagIncludedChunks: true, //pro模式默认值
        occurrenceOrder: true, //pro模式默认值
        providedExports: true, //默认值
        usedExports: true, //pro模式默认值
        sideEffects: true, //pro模式默认值
        noEmitOnErrors: true, //pro模式默认值
        concatenateModules: true, //pro模式默认值 
        splitChunks: {
            minSize: 30000,
            name: false,
            chunks: 'async', //除了缓存组，只有异步组件才分块(可能会没有异步组件)，目的是除了缓存组之外其他js引用全部打入入口文件(因为html js注入是固定的，详见uitls.initEntryAndHtmlPlugin)
            cacheGroups: {
                vendors: {
                    test: /[\\/]{1,2}node_modules[\\/]{1,2}/,
                    name: 'vendors',
                    chunks: 'all',
                    enforce: true
                },
                //对于较大且低频的库可以单独打包，例如下面的echart，在vendors中排出并单独进行打包，并且需要修改注入逻辑，需要单独注入(见./utils下的initEntryAndHtmlPlugin方法)
                // vendors: {
                //     test: /[\\/]{1,2}node_modules[\\/]{1,2}(?!echarts)/,
                //     name: 'vendors',
                //     chunks: 'all',
                //     enforce: true
                // },
                // echarts: {
                //     test: /[\\/]{1,2}node_modules[\\/]{1,2}echarts/,
                //     name: 'echarts',
                //     chunks: 'all'
                // }
            }
        },
        runtimeChunk: {
            name: (entrypoint) => `${config.build.runtimeChunk.baseName}${config.build.runtimeChunk.sep}${entrypoint.name}`
        }
    },
    stats: {
        warnings: true
    }
})

module.exports = prodWebpackConfig;