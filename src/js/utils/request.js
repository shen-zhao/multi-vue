import axios from 'axios';
import qs from 'qs';

function getBaseURL(proxy) {
    if (process.env.NODE_ENV === 'production') {
        return window.app.ctxpath;
    }
    return proxy || '';
}

const BASE_URL = getBaseURL();
const CONTENT_TYPE = 'application/x-www-form-urlencoded';
const FORM_DATA = 'FormData';

/**
 * 错误码列表
 * @param error
 * @returns {*|string}
 */
function statusList(error) {
    const arr = {
        400: '错误请求',
        401: '未授权，请重新登录',
        403: '拒绝访问',
        404: '请求错误,未找到该资源',
        405: '请求方法未允许',
        408: '请求超时',
        500: '服务器端出错',
        501: '网络未实现',
        502: '网络错误',
        503: '服务不可用',
        504: '网络超时',
        505: 'http版本不支持该请求'
    };
    return arr[error.response.status] || `连接错误:${error.response.status}`;
}

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers['Content-Type'] = CONTENT_TYPE;

// 添加请求拦截器
axios.interceptors.request.use(function(req) {
    if (req.method === 'post') {
        if (Object.prototype.toString.call(req.data).includes(FORM_DATA)) {
            req.headers['Content-Type'] = 'multipart/form-data';
        } else {
            req.data = qs.stringify(qs.parse(req.data));
        }
    }
    // 在发送请求之前做些什么
    return req;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

axios.interceptors.response.use(function(res) {
    // 对响应数据做点什么
    return res.data;
}, function(error) {
    // 对响应错误做点什么
    if (error && error.response) {
        error.message = statusList(error);
    } else {
        error.message = '连接到服务器失败';
    }
    return Promise.reject(error);
});

/**
 * get请求
 * @param {String} url 
 * @param {Object} params 参数
 * @param {Object} config 
 */
export function $get(url, params = {}, config = {}) {
    if (Object.prototype.toString.call(params) !== '[object Object]') {
        throw new TypeError('params must be plain object');
    }
    if (Object.prototype.toString.call(config) !== '[object Object]') {
        throw new TypeError('config must be plain object');
    }
    return axios.get(url, Object.assign(config, {params}));
}

/**
 * post请求
 * @param {String} url 
 * @param {Object|QueryString} data 参数
 * @param {Object} config 
 */
export function $post(url, data = {}, config = {}) {
    if (Object.prototype.toString.call(config) !== '[object Object]') {
        throw new TypeError('config must be plain object');
    }
    return axios.post(url, data, config);
}

export default axios;