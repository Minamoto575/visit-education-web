import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const Type = 'type' // 用户类型
const Id = 'id'
const Name = 'name'

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

export function getId() {
  return Cookies.get(Id)
}

export function setId(id) {
  return Cookies.set(Id, id)
}

export function removeId() {
  return Cookies.remove(Id)
}

export function getName() {
  return Cookies.get(Name)
}

export function setName(name) {
  return Cookies.set(Name, name)
}

export function removeName() {
  return Cookies.remove(Name)
}
