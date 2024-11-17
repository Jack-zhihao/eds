const state = {
  isCollapsed: false,
  theme: localStorage.getItem('theme')
}
const mutations = {
  SET_Collapsed(state, val) {
    state.isCollapsed = val
  },
  SET_Theme(state, val) {
    localStorage.setItem('theme', val)
    state.theme = val
  }
}
const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
