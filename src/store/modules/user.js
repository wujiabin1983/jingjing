import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userInfo: {}, // 当前登陆用户的用户代码
    loginTip: '',
    rolesTop: [], // 顶部导航
    router: '', // 路由
    employeeNum: '' // 员工编号
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLESTOP: (state, rolesTop) => {
      state.rolesTop = rolesTop
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_LOGINTIP: (state, loginTip) => {
      state.loginTip = loginTip
    },
    SET_ROUTER: (state, router) => {
      state.router = router
    },
    SET_EMPLOYEENUM: (state, employeeNum) => {
      state.employeeNum = employeeNum
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        commit('SET_USERINFO', userInfo);
      })
    },
    // 路由
    Router({ commit }, router) {
      return new Promise((resolve, reject) => {
        commit('SET_ROUTER', router);
      })
    },
    // 权限
    Roles({ commit }, roles) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', roles);
      })
    },
    RolesTop({ commit }, rolesTop) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLESTOP', rolesTop);
      })
    },

    LoginTip({ commit }, loginTip) {
      return new Promise((resolve, reject) => {
        commit('SET_LOGINTIP', loginTip);
      })
    },

    GetEmplayeeNum({ commit }, employeeNum) {
      return new Promise((resolve, reject) => {
        commit('SET_EMPLOYEENUM', employeeNum)
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // console.log(state.userInfo.userCode, '入口');
        logout(state.userInfo.userCode).then((res) => {
          // console.log(res, 'res');
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USERINFO', {})
          commit('SET_LOGINTIP', '')
          // console.log(Cookies.get('userCode'));
          Cookies.set('userType', '') // 用户类型
          Cookies.set('userCode', '') // 用户ID
          Cookies.set('roles', '') // 按钮权限
          Cookies.set('topNav', '') // 顶部导航
          // Cookies.set('routers', '') // 路由权限
          sessionStorage.removeItem('router') //  路由权限
          sessionStorage.removeItem('topActiveIndex') // 顶部导航
          // console.log(Cookies.get('userCode'));
          // console.log(state.userInfo.userCode, '出口');
          // removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }

    // // 前端 登出
    // FedLogOut({ commit }) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', '')
    //     removeToken()
    //     resolve()
    //   })
    // },
    //  // 前端 登出
    // Redirect({ commit }, userInfo) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // }
  }
}

export default user
