const accessTokenKey = 'accessToken'
const userKey = 'user'

export function getToken() {
  return window.localStorage.getItem(accessTokenKey) || null
}

export function setToken(token = '') {
  window.localStorage.setItem(accessTokenKey, token)
}

export function removeToken() {
  window.localStorage.removeItem(accessTokenKey)
}

export function getUser () {
  try {
    const userStr = window.localStorage.getItem(userKey)
    const user = JSON.parse(userStr)
    return user
  } catch (err) {
    console.error(err)
    return null
  }
  
}

export function setUser (user) {
  if (typeof user != 'object') {
    window.localStorage.setItem(userKey, user) || null
  } else {
    window.localStorage.setItem(userKey, JSON.stringify(user)) || null
  }
}


export function removeUser () {
  window.localStorage.removeItem(userKey)
}
