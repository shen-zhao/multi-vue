const path = require('path');
const fs = require('fs');
//生成html插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//抽提css插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('../config');
const serverConfig = require('../config/server.config');
const buildConfig = require('../build');
const jsTemplate = require('../config/js.template').template;
const env = process.env.NODE_ENV;

exports.resolve = dir => {
    return path.join(__dirname, '..', dir);
}

function fsExistsTest(baseUrl, realPath) { //检测脚本是否存在，不存在则创建
    baseUrl = exports.resolve(baseUrl);
    const dirname = mkdir(realPath.split('/'), baseUrl);
    const isExists = fs.existsSync(dirname);
    if (!isExists) {
        fs.writeFileSync(dirname, jsTemplate);
    }
}

//递归创建目录，返回filename
function mkdir(pathChip, baseUrl) {
    let isExists;
    const currentChip = pathChip.shift();
    if (/\.js$/.test(currentChip)) {
        return path.join(baseUrl, currentChip);
    }
    const dirname = path.join(baseUrl, currentChip);
    
    try {
        isExists = fs.existsSync(dirname);
    } catch (err) {
        throw err;
    }

    if (isExists) {
        return mkdir(pathChip, dirname);
    }

    try {
        fs.mkdirSync(dirname);
    } catch (err) {
        throw err;
    }

    return mkdir(pathChip, dirname);
}

exports.publicPath = (env) => {
    if (env === 'development') {
        return '../';
    }
    return process.argv[2] || config.build.publicPath;
}

exports.assetsPath = _path => {
    const assetsSubDirectory = env === 'production' ?
        config.build.assetsSubDirectory :
        config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path);
}
//dealPageConf
exports.initEntryAndHtmlPlugin = () => {
    const entryMap = {},
        htmlPlugins = [],
        pages = buildConfig.pages,
        baseUrl = buildConfig.baseUrl;

    //公共样式entry
    entryMap['stylesheet'] = ['./src/js/common/stylesheet.js'];
    //全局脚本
    entryMap['globalScript'] = ['./src/js/common/globalScript.js'];

    pages.forEach((obj, i) => {
        //entry
        if (obj.entry) {
            let filePath = obj.entry.lastIndexOf('.js') === (obj.entry.length - 3) ? obj.entry : `${obj.entry}.js`;
            fsExistsTest(baseUrl, filePath);
            entryMap[obj.template] = ['./' + path.join(baseUrl, filePath)];
        }
        //html
        let pluginConf = {
            filename: `./vm/${obj.template}.html`,
            template: `./src/pages/${obj.template}.html`,
            inject: true,
            chunksSortMode: 'dependency',
            chunks: []
        }

        pluginConf.chunks.push(`${config.build.runtimeChunk.baseName}${config.build.runtimeChunk.sep}${obj.template}`); //runtime确立模块间的依赖关系
        obj.stylesheet !== false && pluginConf.chunks.push('stylesheet');
        obj.globalScript !== false && pluginConf.chunks.push('globalScript')
        obj.vendors !== false && pluginConf.chunks.push('vendors');
        obj.echarts && (pluginConf.chunks.push('echarts'));
        pluginConf.chunks.push(obj.template);

        htmlPlugins.push(
            new HtmlWebpackPlugin(pluginConf)
        )
    });

    return {
        entryMap,
        htmlPlugins
    }
}

exports.cssLoaders = options => {
    options = options || {};

    const sourceMap = (env === 'production') ? false : true;

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: sourceMap
        }
    }

    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: sourceMap
        }
    }

    function generateLoaders(loader, loaderOptions) {
        const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: sourceMap
                })
            })
        }

        if (env === 'production') {
            return [MiniCssExtractPlugin.loader, ...loaders]
        } else {
            return ['vue-style-loader', ...loaders]
        }
    }

    return {
        'css': generateLoaders(),
        'scss': generateLoaders('sass'),
        'less': generateLoaders('less')
    }
}

exports.styleLoaders = options => {
    const rules = []
    const loaders = exports.cssLoaders(options);

    for (let extension in loaders) {
        const loader = loaders[extension]
        rules.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader,
            include: [exports.resolve('src')]
        })
    }

    return rules;
}