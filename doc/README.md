## 打包规则

### pages

- 页面入口打包到`vm`目录中
- pages目录下的模板由于配置了html-loader

### js

- 每个页面只有一个js入口, 存放在js目录中
- `node_modules`依赖除去比较大的插件(`echarts`等), 全部打入`vendors.js`中, 注: 最小chunk30kb
- `stylesheet.js`单独打包, 无需手动调用, 自动注入到每个页面中

### css/scss等

- 页面独立的`css/scss`等由相应的js中`import`注入
- 公共的`css/scss`等由`stylesheet.js`统一注入

### html

inc(html碎片)

- 在入口页面用`${require(<path>)}`语法使用`(代替#parse())`, path为入口页面的相对地址

template(html模板)

- 在js中`import`引入, 供字符串模板使用

### img、vedio、audio等静态资源

- 可直接在html碎片、html模板以及style中根据相对路径引用

### mock

- mock目录下包括同步的`js`假数据和异步的`json`假数据
- 开发环境可以正常使用两种`mock`
- 生产测试环境删除`mock`

## 约定规则

### build.js
项目根目录创建`build.js`, 用来指定打包页面入口, 开发某个页面之前必须首先配置页面信息, 示例: 

```js
/* 
baseUrl: 基础入口路径
pages: [ 页面配置
    {
        *template: 页面入口名称, 位置src/pages,
        *entry: js入口文件路径, 🌰 src/js/entry + js名称, 支持子文件夹例如index/index.js会自动生成index目录,
        vendors: 插件来源为node_modules和依赖文件, 包括jQuery, art-template等, 默认引入, false不引入
        globalScript: 全局执行脚本, 例如aside、header脚本, 统一注入, false不引入
        // echarts: echarts库, 注: echarts库比较大, 没有打入vendors, 后续如有大型插件需要单独引用的需修改配置,
        stylesheet: 所有公共样式，如common.scss/form.scss/table.scss/reset.scss等, 默认引入, 为false时不引入
    }
]
 */
module.exports = {
    baseUrl: 'src/js/entry',
    pages: [
        {
            template: 'index',
            entry: 'index/index.js'
        },
        {
            template: 'login',
            entry: 'login/index.js'
        },
        {
            template: 'main',
            entry: 'main/index.js'
        }
    ]
};
```

### 资源路径

1.页面入口引入html碎片制定语法: `${require(<path>)}`, 另外, 模板中还可以引入其他模板, 示例: 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>$!title</title>
    <!-- 引入inc/head.html -->
    ${ require('../inc/head.html') }
</head>
<body>
<!-- 引入inc/index.html -->
${ require('../inc/index.html') }
</body>
</html>
```

2.img、vedio、audio等标签引入资源可以直接`src='相对路径'`, 也可以用`src='${ require(<!path>) }'`方式, 示例: 

```html
<div>
    <div>
        <h1>dfsgsdfg</h1>
        <img src="${require('../assets/images/logo.png')}" alt="">
    </div>
    <img src="../assets/images/logo.png" alt="">
</div>
```

### json访问
如果开发环境需要访问json数据，需要在`src\js\service\api.js`添加对应关系，如下：
```javascript
module.exports = {
    'app/detail': 'mock/json/detail.json',
    'app/list': 'mock/json/list.json'
};
```
其中`key`为`真实路径`，`value`为对应的`mock json`，实际开发中，直接访问`真实接口`即可

### 配置代理
接口代理配置见`config\server.config.js`中的`proxyTable`字段

### 语法

1.支持最新的`es`语法, 以及`stage-2`阶段的语法, 最后统一编译成ES5语法

2.html(包括/pages、/inc)中支持使用`velocity`语法(需`velocity服务器`支持, 不支持`#parse`)

3.模块引入

js、vue文件
- 使用`import`语法, 建议`node_modules`依赖前置, 本地依赖次之
- 扩展名`js`、`vue`、`json`可省略
- @代表/src, 例如引入index.js, `import index from '@/js/index'`, 更多别名可在scripts/webpack.base.conf.js中配置

vue文件
- 根据.vue规则进行coding

html文件
- 使用`${require(<!path>)}`