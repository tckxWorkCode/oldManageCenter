const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters,
  permission_routers: state => state.permission.routers,
  leftMenuViews: state =>state.leftMenuData.leftMenuViews,
}
export default getters