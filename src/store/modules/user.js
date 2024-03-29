import { changePassword, login, logout } from '@/api/user'
import { getToken, removeId, removeName, removeToken, removeType, setId, setName, setToken, setType } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  id: undefined,
  name: '',
  avatar: '',
  introduction: '',
  type: '', // 管理员类型
  roles: []
}

// 事件
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_TYPE: (state, type) => {
    state.type = type
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

// 类似mutations 通过dispatch提交 支持异步

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ name: username.trim(), password: password }).then(response => {
        // console.log(response);
        if (response.code === 200) {
          const token = response.extra.token
          const id = response.extra.id
          const name = response.extra.name
          const type = response.extra.type
          commit('SET_TOKEN', token)
          commit('SET_ID', id)
          commit('SET_NAME', name)
          commit('SET_TYPE', type)
          setToken(token)
          setType(type)
          setId(id)
          setName(name)
        }
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info  模拟从后端获取 只支持admin模式
  getInfo({ commit }) {
    return new Promise((resolve) => {
      commit('SET_ROLES', ['admin'])
      commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
      commit('SET_INTRODUCTION', 'ILOVEWHU')
      resolve({
        roles: ['admin'],
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        introduction: 'ILOVEWHU'
      })

      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject('验证失败，请重新登录')
      //   }

      //   const { roles, name, avatar, introduction } = data

      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles must be a non-null array!')
      //   }
      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then((response) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeId()
        removeType()
        removeName()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 修改密码
  changePassword({ commit, state, dispatch }, data) {
    return new Promise((resolve, reject) => {
      changePassword(data).then((response) => {
        if (response.code === 200) {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeId()
          removeType()
          resetRouter()
          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
