import axios from 'axios'
import { message } from 'ant-design-vue'
import { setToken, getToken, removeToken, removeUser } from '@/utils/auth'
import Router from '@/router/index'
message.config({
  top: `64px`,
  duration: 2,
  maxCount: 3,
})

/**
 * 加载环境变量
 */
const baseURL = import.meta.env.VITE_APP_BASE_API
const service = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
})
window.axiosCalcelTokenArr = []
// 请求前拦截
service.interceptors.request.use(
  config => {
    /**给每个请求一个token 标记，用于页面切换。取消上个未完成的接口请 */
    config.cancelToken = new axios.CancelToken(cancel => {
      window.axiosCalcelTokenArr.push({ cancel })
    })
    config.headers.Authorization = `Bearer ${getToken()}`
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

const successRes = res => {
  // 接口请求成功
  return res.data
}
const successChange = res => {
  // 删除，修改记录成功
  message.success(res.data.message || '操作成功！')
  return res.data
}
const warning = res => {
  // 请求失败，字段缺失
  message.warning(res.data.message)
  return Promise.reject(res.data.message)
}
const danger = res => {
  // 请求失败，原因message
  message.error(res.data.message)
  return Promise.reject(res.data.message)
}
const timeOut = res => {
    removeToken()
    removeUser()
    message.error('登录身份已过期，请重新登录！')
    window.location.href = '/#/login'
    return Promise.reject()
}

// 响应拦截
service.interceptors.response.use(
  res => {
    console.log('interceptors', res)
    switch (res.status) {
      case 200:
        return successRes(res)
      case 201:
        return successChange(res)
      case 202:
        return danger(res)
      case 203:
        return successChange(res)
      case 204:
        return danger(res)
      case 301:
        return danger(res)
      case 302:
        return warning(res)
      case 401:
        return timeOut(res)
      case 403:
        return timeOut(res)
      default:
        return danger(res)
    }
  },
  err => {
    if (err.response?.status === 401) {
        timeOut()
        return
    }
    // 处理403 重新登录逻辑
    if (err.response?.status === 403) {
        timeOut()
       return
    }
    // 过滤掉cancel 接口请求的提示
    if (err.message !== '未完成的接口请求已取消') {
      message.error(err.response.data?.message || err.message)
    }
    return Promise.reject(err)
  }
)
//增加一个axios 实例service的属性download
service.download = async ({ url, params, method, data }) => {
  const fullUrl = baseURL + url // 注意baseURL最后是否有'/', url一般都写了'/'，所以环境变量配置url的最后一般不加'/'
  const res = await axios(fullUrl, {
    method,
    params,
    data,
    responseType: 'blob',
    headers: {
      accessToken: getToken(),
    },
  })
  if (!res.data) {
    message.error('文件下载失败')
    return
  }
  // 保存文件
  const { fileName = '' } = params || {}
  let blobUrl = window.URL.createObjectURL(res.data)
  let link = document.createElement('a')
  link.href = blobUrl
  fileName && link.setAttribute('download', fileName)
  link.click()
  window.URL.revokeObjectURL(blobUrl)
}

Router.beforeEach((to, from) => {
  window.axiosCalcelTokenArr.forEach((item, index) => {
    if (item) {
      item.cancel('未完成的接口请求已取消!')
      window.axiosCalcelTokenArr.splice(index, 1)
    }
  })
  return true
})

export default service
