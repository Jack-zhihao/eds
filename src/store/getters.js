const getters = {
  menuList: state => state.menuInfo.menuList,
  menuOpenKeys: state => state.menuInfo.menuOpenKeys,
  menuSelectedKeys: state => state.menuInfo.menuSelectedKeys,
  isCollapsed: state => state.appInfo.isCollapsed,
  theme: state => state.appInfo.theme
}
export default getters
