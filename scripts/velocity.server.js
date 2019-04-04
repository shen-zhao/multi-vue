require('./check-versions');

const fs = require('fs');
const path = require('path');
const File = require('vinyl');
const express = require('express');
const Velocity = require('velocityjs');
const webpack = require('webpack');
const serveIndex = require('serve-index')
const JSON5 = require('json5');
const open = require('open')
const webpackDevMiddleware = require('webpack-dev-middleware');
const proxyMiddleware = require('http-proxy-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const serverConfig = require('../config/server.config');
const devConfig = require('./webpack.dev.conf');
const utils = require('./utils');
const config = require('../config');
//真实接口与mock对应表
const apiMap = require('../src/js/service/api');

const compiler = webpack(devConfig);

const app = express();
const appPath = utils.resolve('dev');
const port = serverConfig.port;
const proxyTable = serverConfig.proxyTable;
const progress = config.dev.progress;
const autoOpen = config.dev.autoOpen;

function getExtname(filePath) {
    return (new File({
        path: filePath
    })).extname;
}

function parseVm(req, res, next) {
    const isVm = serverConfig.vm.indexOf(getExtname(req.path)) >= 0;
    if (!isVm) {
        return next();
    }

    const vmPath = path.join(appPath, req.path);
    compile(vmPath, function (err, ret) {
        if (err) {
            return next(err);
        }
        res.set('Content-Type', 'text/html; charset=utf-8');
        res.send(ret);
    });
}

function compile(vmPath, callback) {
    const vmFile = new File({
        path: vmPath
    });
    const contextFile = new File({
        path: vmPath
    });
    contextFile.extname = '.js';

    const template = getFileContent(vmPath);
    if (null === template) {
        const err = new Error('File not found:' + vmPath);
        err.status = 404;
        return callback(err);
    }
    vmFile.contents = new Buffer(template);
    let context;
    try {
        delete require.cache[require.resolve(contextFile.path)];
        context = require(contextFile.path);
    } catch (err) {}

    try {
        const html = Velocity.render(template, context, {}, {
            escape: false
        });
        callback(null, html);
    } catch (err) {
        return callback(err);
    }
}

function getFileContent(filePath) {
    let content = null;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {}
    return content;
}

if (progress) {
    new webpack.ProgressPlugin({
        profile: false
    }).apply(compiler);
}

app.set('views', appPath);
/* require proxy */
Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context]
    if (typeof options === 'string') {
        options = {
            target: options
        }
    }
    app.use(proxyMiddleware(options.filter || context, options))
})
/* velocity */
app.use(parseVm);
/* no-cache */
app.use(function (req, res, next) {
    res.set(serverConfig.responseHeaders);
    next();
});
//浏览JSON
app.use(function (req, res, next) {
    let reg = /\/mock\/json\/\w+\.json$/;
    let filePath = path.join(appPath, req.path);
    if (reg.test(filePath)) {
        let result = fs.readFileSync(filePath, 'utf8')

        return res.send(JSON5.parse(result));
    }
    next();
});
//开发环境请求接口访问对应JSON MOCK
app.use(function (req, res, next) {
    const reqPath = req.path;
    const apiKey = Object.keys(apiMap).find(key => reqPath.endsWith(key));
    const mockPath = apiMap[apiKey];

    if (mockPath !== undefined) {
        let filePath = path.join(appPath, mockPath);
        let result = fs.readFileSync(filePath, 'utf8')

        return res.send(JSON5.parse(result));
    }
    next();
});
app.use(serveIndex(appPath, {
    icons: true
}));
app.use(express.static(appPath));

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: devConfig.output.publicPath,
    writeToDisk: true,
    watchOptions: {
        poll: config.dev.poll,
    },
    overlay: false,
    quiet: true,
    stats: {
        builtAt: false,
        assets: false,
        children: false,
        chunks: false,
        entrypoints: false,
        modules: false,
        version: false,
        hash: false
    },
    logLevel: 'silent'
})
// webpack hot-reload middleware(热刷新)
const hotMiddleware = webpackHotMiddleware(compiler)

let isFirst = true;
compiler.plugin('done', function () {
    if (autoOpen && isFirst) {
        open(`http://localhost:${port}`);
        isFirst = false;
    }
});

// webpack server middleware (watch)
app.use(devMiddleware);

app.use(hotMiddleware);

module.exports = app.listen(port, (err) => {
    if (err) {
        throw err;
    }
})