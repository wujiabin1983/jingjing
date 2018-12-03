const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  router: state => state.user.router,
  roles: state => state.user.roles,
  rolesTop: state => state.user.rolesTop,
  userInfo: state => state.user.userInfo,
  loginTip: state => state.user.loginTip,
  employeeNum: state => state.user.employeeNum,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers,
  constantRouterMap: state => state.permission.constantRouterMap
}
export default getters
