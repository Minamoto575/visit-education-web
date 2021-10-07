import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const Type = 'type' //用户类型

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getType() {
  return Cookies.get(Type)
}

export function setType(type) {
  return Cookies.set(Type, type)
}

export function removeType() {
  return Cookies.remove(Type)
}
