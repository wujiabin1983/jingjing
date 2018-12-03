import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getRouterLink } from '@/api/topNav'
import { constantRouterMap } from '@/router/index'
import Cookies from 'js-cookie'

// const topNav = Cookies.get('topNav');
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  // console.log(JSON.stringify(store.getters.router), 'store.getters.router');
  // console.log(to.path)
  if (to.path === '/reload') {
    sessionStorage.removeItem('router');
  }
  if (Cookies.get('userType')) {
    // 有账户类型
    if (sessionStorage.getItem('router')) { // 判断当前用户是否已拉取完路由权限信息
      // console.log('有路由');
      // console.log(sessionStorage.getItem('router'), '路由');
      store.dispatch('Router', JSON.parse(sessionStorage.getItem('router')))
      // if (store.getters.addRouters.length === 0) {
      let params = {
        userType: Cookies.get('userType'),
        routerMap: store.getters.router
      }
      // console.log('即将进入路由表生成');
      store.dispatch('GenerateRoutes', params).then(() => { // 根据roles权限生成可访问的路由表
        // 初始化路由
        let isAdd = false;
        store.getters.addRouters.forEach((val) => {
          if (JSON.stringify(router.options.routes).indexOf(JSON.stringify(val)) == -1) {
            router.options.routes.push(val)
            isAdd = true;
          }
        });
        if (isAdd) {
          if (router.options.routes.length != store.getters.addRouters.length) {
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            // next({ ...to, replace: true })
          }
        }
        if (to.matched.length > 0) {
          store.dispatch('Roles', to.matched[0].meta.roleBtn)
          sessionStorage.setItem('roles', JSON.stringify(to.matched[0].meta.roleBtn))
          if (to.path != '/dashboard') {
            let indexPath = [to.path]
            sessionStorage.setItem('indexPath', JSON.stringify(indexPath))
            // console.log(sessionStorage.getItem('indexPath'), 'indexPath')
          }
          next()
        } else {
          let path = JSON.parse(sessionStorage.getItem(to));
          if (to.path != '/dashboard') {
            // console.log('进入子页面');
            sessionStorage.setItem('path', to.path)
            store.dispatch('Roles', JSON.parse(sessionStorage.getItem('roles')))
            next(to.path)
            // next()
          }
        }
        next()
      })
    } else {
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
      } else {
        next('/login') // 否则全部重定向到登录页
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
})

router.afterEach(() => {
})
