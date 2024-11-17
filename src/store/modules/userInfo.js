import { login } from '@/api/login'
import { setToken, setUser, getUser } from '@/utils/auth'

const userInfo = {
  namespaced: true,
  state: () => ({
    user: getUser() || {},
  }),
  mutations: {
    set_User(state, value) {
      state.user = value
    },
  },
  actions: {
    Login({ state, commit }, loginForm) {
      return new Promise((resolve, reject) => {
        login(loginForm).then((res) => {
            console.log('res', res)
          if (!res || !res.data) return reject()
          commit('set_User', res.data.user)
          setToken(res.data.token)
          setUser(res.data.user)
          resolve()
        }).catch((error) => {
          reject(error)
        })
      })
    }
  },
}

export default userInfo
