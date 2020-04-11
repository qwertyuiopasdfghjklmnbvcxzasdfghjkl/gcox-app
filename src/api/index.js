import axios from 'axios'
import JsCookies from 'js-cookie'
import config from './config'
import userApi from '@/api/user'

const DOMAIN = config.url

axios.defaults.baseURL = DOMAIN

// 添加请求参数-用户灰度测试
function getUrlHashParams() {
  let hash = location.hash
  if (!hash) {
    return {}
  }
  if (hash.indexOf('?') === -1) {
    return {}
  }
  let ps = hash.substring(hash.indexOf('?') + 1)
  if (!ps) {
    return {}
  }
  ps = ps.split('&')
  let param = {}
  for (let i = 0; i < ps.length; i++) {
    let p = ps[i].split('=')
    if (p[0]) {
      param[p[0]] = p[1] || ''
    }
  }
  return param
}

let search = getUrlHashParams().izone || null
console.log(search)

let parmes = ''

if (search) {
  parmes = '?izone=' + search
}

console.log(parmes)

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  var apiToken = JsCookies.get('api_token')
  var lang = localStorage.getItem('lang') || 'en'
  apiToken && (config.headers.common['api_token'] = apiToken)
  config.headers.common['uuid'] = userApi.uuid
  config.headers.common['lang'] = lang
  // 在发送请求之前做些什么
  Indicator.open({
    text: 'Loading...',
  });
  return config
}, function (error) {
  // 对请求错误做些什么
  console.log('24'+error)
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  console.log(response)
  if (typeof response.data === 'string') {
    let error = {response: response}
    return Promise.reject(error)
  }

  if ((response.data && response.data.rst === 401) || response.status === 403 || response.status === 401 ) {
    console.error(response.config.url)
    console.log('用户不存在，退出登录')
    // 用户不存在，退出登录
    window.localStorage.removeItem('userInfo')
    console.log('clearToken')
    JsCookies.remove('api_token')
    window.location.reload()
    Indicator.close();
    return null
  }
  // 对响应数据做点什么
  Indicator.close();
  return response
}, function (error) {
  // 对响应错误做点什么
  console.log('52'+error)
  Indicator.close();
  return Promise.reject(error)
})

let api = {}
api.domain = DOMAIN

const get = function (url, data, success, error) {
  if (typeof data === 'function') {
    error = success
    success = data
    data = {}
  }
  axios.get(url + parmes, {
    params: data
  }).then((res) => {
    if (!res) { return }
    success && success(res.data)
  }).catch((res) => {
    console.warn(res)
    error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res)
  })
}
api.get = get

const post = function (url, data, success, error) {
  if (typeof data === 'function') {
    error = success
    success = data
    data = {}
  }
  axios.post(url + parmes, data).then((res) => {
    if (!res) { return }
    success && success(res.data)
  }).catch((res) => {
    console.warn(res)
    error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res)
  })
}
api.post = post

const del = function (url, data, success, error) {
  if (typeof data === 'function') {
    error = success
    success = data
    data = {}
  }
  axios.delete(url + parmes, {
    data: data
  }).then((res) => {
    if (!res) { return }
    success && success(res.data)
  }).catch((res) => {
    console.warn(res)
    error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res)
  })
}
api.delete = del

const put = function (url, data, success, error) {
  if (typeof data === 'function') {
    error = success
    success = data
    data = {}
  }
  axios.put(url + parmes, data).then((res) => {
    if (!res) { return }
    success && success(res.data)
  }).catch((res) => {
    console.warn(res)
    error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res)
  })
}
api.put = put

const postForm = function (url, data, success, error) {
  if (typeof data === 'function') {
    error = success
    success = data
    data = {}
  }
  axios.post(url + parmes, data).then((res) => {
    if (!res) { return }
    success && success(res.data)
  }).catch((res) => {
    console.warn(res)
    error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res)
  })
}
api.postForm = postForm

export default api
