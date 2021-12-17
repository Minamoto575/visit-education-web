import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'get'
  })
}

export function changePassword(data) {
  return request({
    url: '/admin/changePassword',
    method: 'post',
    data
  })
}

export function deleteAdmin(deleteId) {
  return request({
    url: '/admin/delete',
    method: 'post',
    params: { deleteId }
  })
}

export function listall(data) {
  return request({
    url: '/admin/listall',
    method: 'get'
  })
}

export function register(data) {
  return request({
    url: '/admin/register',
    method: 'post',
    data
  })
}

export function testName(name) {
  return request({
    url: '/admin/testName',
    method: 'get',
    params: { name }
  })
}

export function listAll(data) {
  return request({
    url: '/admin/search/all',
    method: 'post',
    data
  })
}

export default {
  login,
  logout,
  changePassword,
  deleteAdmin,
  listall,
  register,
  testName,
  listAll
}
