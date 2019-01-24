const webpack = require('webpack');
const merge = require('webpack-merge');
const ora = require('ora');
const utils = require('./utils');
const config = require('../config');
const webpackConfig = require('./webpack.base.conf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//压缩js
const uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

const testWebpackConfig = merge(webpackConfig, {
    mode: 'none',
    devtool: 'eval-source-map',
    output: {
        publicPath: utils.publicPath('production')
    },
    optimization: {
        minimize: true, //pro模式默认值
        minimizer: [
            new uglifyjsWebpackPlugin({
                test: /\.js($|\?)/i,
                parallel: true,
                cache: true,
                sourceMap: true,
                uglifyOptions: {
                    // ie8: true
                }
            }),
            new MiniCssExtractPlugin({
                filename: utils.assetsPath('styles/[name].[hash:8].css')
            }),
        ],
        flagIncludedChunks: true, //pro模式默认值
        occurrenceOrder: true, //pro模式默认值
        providedExports: true, //默认值
        usedExports: true, //pro模式默认值
        sideEffects: true, //pro模式默认值
        noEmitOnErrors: true, //pro模式默认值
        concatenateModules: true, //pro模式默认值  消除代码副作用并优化模块大小
        splitChunks: {
            minSize: 30000,
            name: false,
            chunks: 'async', //除了缓存组，只有异步组件才分块(可能会没有异步组件)，目的是除了缓存组之外其他js引用全部打入入口文件(因为html js注入是固定的，详见uitls.dealPageConf)
            cacheGroups: {
                vendors: {
                    test: /[\\/]{1,2}node_modules[\\/]{1,2}(?!echarts)/,
                    name: 'vendors',
                    chunks: 'all',
                    enforce: true
                },
                echarts: {
                    test: /[\\/]{1,2}node_modules[\\/]{1,2}echarts/,
                    name: 'echarts',
                    chunks: 'all'
                }
            }
        },
        runtimeChunk: {
            name: (entrypoint) => `${config.build.runtimeChunk.baseName}${config.build.runtimeChunk.sep}${entrypoint.name}`
        }
    }
})

let spinner = ora('building for test environment...');
spinner.start();

webpack(testWebpackConfig, (err, stats) => {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n')
});