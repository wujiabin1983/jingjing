import { asyncRouterMap, constantRouterMap } from '@/router/index'
const _import = require('@/router/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // console.log(roles, route, str, 'this is hasPermission');
  if (route.meta && route.meta.role) {
    //console.log(route.meta.role.indexOf(roles) >= 0, 'this is userRoute')
    return route.meta.role.indexOf(roles) >= 0
  } else {
    return true
  }
}
function getStr(str) {
  return str.split("'")[1]
}
// 转换layout
function stringToObj(router) {
  router.forEach(val => {
    if (val.path != '*') {
      if ( val.component.indexOf('_import') >= 0) {
        val.component = _import(getStr(val.component))
        // console.log(val.component, 'val.component')
      } else {
        // if (val.noDropdown === 'true') {
        //   val.noDropdown = true
        // } else {
        //   val.noDropdown = false
        // }
        val.component = Layout;
        // console.log(val.component)
      }
    }
    if (val.children) {
      stringToObj(val.children)
    }
  })
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  // console.log(asyncRouterMap, roles, str,  'this is filterRoles');
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })


  return accessedRouters
}

const permission = {
  state: {
    constantRouterMap: constantRouterMap,
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
   	// 静态
    //  let accessedRouters = filterAsyncRouter(asyncRouterMap, data.userType)
//		动态
        let accessedRouters = filterAsyncRouter(data.routerMap, data.userType)
        stringToObj(accessedRouters)
        // console.log(accessedRouters);
        accessedRouters = Array.from(new Set(accessedRouters));
        commit('SET_ROUTERS', accessedRouters)
        resolve(constantRouterMap)   
      })
    }
  }
}

export default permission
