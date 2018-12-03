import axios from 'axios'
import Cookie from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: '../../mock/',
  timeout: 15000                  // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
// Do something with request error
//console.log(error) // for debug
  Promise.reject(error)
})
export default service
