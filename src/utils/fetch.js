import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
// import store from '../store'
// import { getToken } from '@/utils/auth'
// cookies
import NProgress from 'nprogress'
import Cookie from 'js-cookie'
import router from '@/router'
import store from '../store'
import { Message } from 'element-ui'
import { isInnerIPFn } from './validateIp'
import { resetUserToken } from '@/api/public'
let baseUrl = ''
// baseURL: process.env.BASE_API, // api的base_url
// baseUrl = '../../mock/' // mock 前后端分离测试
//  baseUrl = 'http://172.18.10.52:8080/scrm' // 本地
// baseUrl = 'http://localhost:9999' // 本地打包 - 张婉
// baseUrl = 'http://192.168.10.163/scrm' // 本地打包 - 丁佳佳
baseUrl = 'http://dk.qipai.com.cn/scrm'
// baseUrl = 'http://dsh.nat200.top/scrm'


// baseUrl = 'http://webapp.natapp4.cc' // 测试权限
// baseUrl = 'http://220.160.104.37/scrm'
// baseUrl = 'http://58.23.56.37/scrm'
// baseUrl = 'http://220.160.104.37/scrm' // 外网
// baseUrl = 'http://192.168.10.162/scrm' // 内网

 if (isInnerIPFn()) {
   // 内网
   baseUrl = 'http://192.168.10.163:80/scrm'
 } else {
   // 外网
   baseUrl = 'http://dk.qipai.com.cn:80/scrm'
 }
// 创建axios实例
const service = axios.create({
  baseURL: baseUrl,
  timeout: 100000,   // 请求超时时间
  	validateStatus: function(status) {
  		let message = ''
		switch (status) {
	  case 401:
	    message = '未授权，请重新登录'
					break

	  case 403:
	    message = '拒绝访问'
					break

	  case 404:
	    message = '请求地址出错'
					break

	  case 408:
	    message = '请求超时'
					break

	  case 500:
	    message = '服务器内部错误'
					break

	  case 501:
	    message = '服务未实现'
					break

	  case 502:
	    message = '网关错误'
					break

	  case 503:
	    message = '服务不可用'
					break
	  case 504:
	    message = '网关超时'
					break

	  case 505:
	    message = 'HTTP版本不受支持'
					break
	  default:
	     		    return status
		}
	if (message) {
		Message({
			message: message,
			type: 'error'
		})
	}
  }
})

Cookie.set('baseUrl', baseUrl)

async function reloadPush() {
  await location.reload() // 为了重新实例化vue-router对象 避免bug
  await setTimeout(function() {
  router.push({
  path: '/login'
})
	}, 20)
}

function handlePost(url, config) {
	window.isSuccess = false
	let userId = sessionStorage.getItem('userId')
	const userToken = sessionStorage.getItem('userToken')
	const userType = sessionStorage.getItem('userType')
	const userCode = userType == 'EMPLOYEE' ? sessionStorage.getItem('GetEmplayeeNum'):''
	const params = Base64.encode(JSON.stringify({
		userId: userId,
		userToken: userToken,
		userCode: userCode,
		userType: userType
	}))
	let data
	$.ajax({
		url: baseUrl + url,
		data: params,
		async: false,
		type: 'POST',
		complete: function(res) {
			if (res.readyState != 4) {
				Message({
					message: res.statusText,
					type: 'error',
					onClose() {
						sessionStorage.removeItem('loginRadio')
						sessionStorage.removeItem('roles')
						sessionStorage.removeItem('router')
						sessionStorage.removeItem('userAccount')
						sessionStorage.removeItem('GetEmplayeeNum')
						sessionStorage.removeItem('userId')
						sessionStorage.removeItem('userToken')
						sessionStorage.removeItem('userType')
						router.push({
							path: '/login'
						})
					}
				})
				return false
			} else{
				data = JSON.parse(Base64.decode(res.responseText))
			}
			if (data.messageType == 'SUCCESS') {
				sessionStorage.setItem('userToken', data.messageContent.userToken)
				window.isSuccess = true
			} else {
				window.isSuccess = false
				Message({
					message: data.messageContent,
					type: 'warning',
					duration: 10000,
					onClose() {
						store.dispatch('LogOut').then((res) => {
							reloadPush()
						})
					}
				})
			}
		}
	})
	if (window.isSuccess) {
		window.isSuccess = null
		return config
	} else {
		window.isSuccess = null
		return null
	}
}

/* 请求前 拦截器 */
service.interceptors.request.use(config => {
	NProgress.start()
	if (config.url.indexOf('I_SCRM_INTERFACE_001') > 0 || config.url.indexOf('userLogout') > 0 || config.url.indexOf('I_SCRM_INTERFACE_000') > 0 || config.url.indexOf('I_SCRM_INTERFACE_003') > 0 || config.url.indexOf('I_SCRM_INTERFACE_002') > 0 || config.url.indexOf('I_SCRM_INTERFACE_621') > 0) {
		return config
	} else if (sessionStorage.getItem('userToken').length > 0) {
	//return handlePost('/I_SCRM_INTERFACE_000.action', config)
	config.headers.common['Authorization'] = sessionStorage.getItem('userToken')
	return config
}
}, error => {
	return Promise.reject(error)
})

/* 响应 拦截器 */
service.interceptors.response.use(response => {
	NProgress.done()
	//console.log(JSON.stringify(response)+'成功')
	return response
}, error => {
	//console.log(JSON.stringify(error)+'错误')
	NProgress.done()
	if (error.response.status === 401) {
		sessionStorage.removeItem('loginRadio')
		sessionStorage.removeItem('roles')
		sessionStorage.removeItem('router')
		sessionStorage.removeItem('userAccount')
		sessionStorage.removeItem('GetEmplayeeNum')
		sessionStorage.removeItem('userId')
		sessionStorage.removeItem('userToken')
		sessionStorage.removeItem('userType')
		router.push({
			path: '/login'
		});
	};
	if (error.code == 'ECONNABORTED') {
		Message({
			message: '请求超时，请稍后重试！',
			type: 'error'
		})
	}
//		if(err && err.response && err.response.status) {
//			switch(err.response.status) {
//				case 400:
//					err.message = err.response.data.message
//					break
//				case 401:
//					err.message = '未授权，请重新登录'
//					break
//
//				case 403:
//					err.message = '拒绝访问'
//					break
//
//				case 404:
//					err.message = `请求地址出错: ${err.response.config.url}`
//					break
//
//				case 408:
//					err.message = '请求超时'
//					break
//
//				case 500:
//					err.message = '服务器内部错误'
//					break
//
//				case 501:
//					err.message = '服务未实现'
//					break
//
//				case 502:
//					err.message = '网关错误'
//					break
//
//				case 503:
//					err.message = '服务不可用'
//					break
//				case 504:
//					err.message = '网关超时'
//					break
//
//				case 505:
//					err.message = 'HTTP版本不受支持'
//					break
//				default:
//
//			}
//		}
//		if(err.message) {
//			Message({
//				message: '请求超时，请稍后重试！',
//				type: 'error'
//			})
//		}
//		if(err.response.status === 401) {
//			sessionStorage.removeItem('loginRadio')
//			sessionStorage.removeItem('roles')
//			sessionStorage.removeItem('router')
//			sessionStorage.removeItem('userAccount')
//			sessionStorage.removeItem('userId')
//			sessionStorage.removeItem('userType')
//			sessionStorage.removeItem('userToken')
//			sessionStorage.removeItem('GetEmplayeeNum')
//			router.push({
//				path: '/login'
//			});
//		}
return Promise.reject(error.response.data)
}
)

export default service
