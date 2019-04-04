const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const config = require('../config');
const utils = require('./utils');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const pageConf = utils.initEntryAndHtmlPlugin();
const env = process.env.NODE_ENV;
const target = env === 'production' ? 'dist' : 'dev';


const baseConfig = {
    context: path.resolve(__dirname, '../'),
    entry: pageConf.entryMap,
    output: {
        path: env === 'production' ? config.build.assetsRoot : config.dev.assetsRoot,
        filename: utils.assetsPath(env === 'production' ? 'js/[name].[chunkhash:8].js' : 'js/[name].js')
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': utils.resolve('src'),
            'js': utils.resolve('src/js'),
            'server': utils.resolve('src/js/server'),
            'utils': utils.resolve('src/js/utils'),
            'components': utils.resolve('src/js/components'),
            'lib': utils.resolve('src/js/lib'),
            'common': utils.resolve('src/js/common')
        }
    },
    module: {
        rules: [
            ...utils.styleLoaders({
                usePostCSS: true
            }),
            //vue
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: utils.cssLoaders(),
                    transformAssetUrls: {
                        video: ['src', 'poster'],
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            },
            //eslint
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                options: {
                    formatter: require('eslint-friendly-formatter'),
                    emitWarning: true
                },
                include: [utils.resolve('src')]
            },
            //babel
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                },
                include: [utils.resolve('src')]
            },
            { //引入html模板提供给arttemplate/或vue-template使用
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    //开启压缩
                    minimize: true,
                    interpolate: 'require'
                },
                include: [utils.resolve('src/templates'), utils.resolve('src/js')]
            },
            { //处理非js引用html时对静态资源进行处理（代替velocity的#parse()） //此loader会导致HTMLPlugin ejs模板失效
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    interpolate: 'require', //支持页面里面的require语法
                    removeComments: true,
                    attrs: ['img:src', 'video:src', 'audio:src'] //修改静态资源前缀
                },
                include: [utils.resolve('src/pages'), utils.resolve('src/inc')]
            },
            { //图片处理
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: utils.assetsPath('img/[name].[hash:8].[ext]'),
                    publicPath: utils.publicPath(env)
                },
                include: [utils.resolve('src')]
            },
            { //管理字体
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: utils.assetsPath('font/[name].[hash:8].[ext]'),
                    publicPath: utils.publicPath(env)
                },
                include: [utils.resolve('src')]
            },
            { //管理媒体
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: utils.assetsPath('media/[name].[hash:8].[ext]'),
                    publicPath: utils.publicPath(env)
                },
                include: [utils.resolve('src')]
            }
        ]
    },
    plugins: [
        ...pageConf.htmlPlugins, //实例多页面入口
        new CleanWebpackPlugin([target], {
            root: utils.resolve(''),
            verbose: false, //开启在控制台输出信息
            dry: false
        }),
        new webpack.DefinePlugin({
            'process.env': require('../config/env.config')[env]
        }),
        //webpack4.0使用vue-loader需要添加此插件
        new VueLoaderPlugin()
    ]
}

module.exports = baseConfig;