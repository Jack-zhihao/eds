import request from '@/utils/request'

/** 用户登录 */
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}
/** 退出登录 **/
export function logout(data) {
  return request({
    url: '/logout',
    method: 'post',
    data,
  })
}

// /** 用户注册 */
// export function register(data) {
//   return request({
//     url: '/register',
//     method: 'post',
//     data,
//   })
// }
