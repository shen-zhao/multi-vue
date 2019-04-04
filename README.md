# multi-vue

Vue多页面应用

# 安装


**安装依赖**

```npm install```

**开发**

```npm run dev```

**测试**

```npm run test //locahost:8080/ (静态资源地址, 默认为/, 默认值可以在config/index.js/build.publicPath修改, 必须以/结尾)```

**生产**

```npm run build //locahost:8080/ (静态资源地址, 默认为/, 默认值可以在config/index.js/build.publicPath修改, 必须以/结尾)```

注意：windows环境下静态资源路径必须为包含host的绝对路径


# 项目结构

```markdown
Projet
├──scripts  webpack配置, 构建脚本
├──config  资源配置
├──dist  生产产物, 用于测试或生产
├──dev  开发产物, 用于代码调试(页面入口dev/vm)
├──src
   ├─ assets  资源
   │    ├─ images  图片资源
   │    ├─ video  视频资源
   │    ├─ font  字体
   │    └─ audio  音频资源
   │
   │
   ├─ inc  html组件, 供页面直接
   │
   │
   ├─ js  脚本
   │   ├─ lib  插件或插件封装
   │   ├─ common  公共内容
   │   │    ├─ globalScript.js  全局脚本
   │   │    └─ stylesheet.js  公共样式入口
   │   ├─ components  公共组件
   │   ├─ entry 页面js入口
   │   ├─ server 请求相关
   │   │    └─ api.js  接口路由mock数据对应表
   │   └─ utils
   │        └─ request.js  请求方法封装
   │ 
   │ 
   ├─ mock  模拟数据
   │    ├─ js  -velocity mock
   │    └─ json  -ajax mock
   │  
   │
   ├─ pages 页面入口
   │  
   │
   └─ styles CSS 
        │   
        ├─ helpers 
        │    ├─ helpers.scss
        │    ├─ mixin.scss
        │    └─ function.scss
        └─ index.scss··· 各页面css
│ 
├──build.js  bundle config
```

# [Document](https://github.com/shen-zhao/multi-vue/tree/master/doc)

# 参考资料

- [wepback](https://www.webpackjs.com/concepts/)
- [babel](http://babeljs.io/docs/en)
- [vue-cli2.0](https://github.com/vuejs/vue-cli/tree/v2.9.3)
- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
- [使用 webpack3 配置多页应用（一）](https://www.jianshu.com/p/2cc4a1078953)