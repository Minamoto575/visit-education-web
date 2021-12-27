import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '../router'
import { getToken, removeId, removeName, removeToken, removeType } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  timeout: 3000000,
  // baseURL: 'http://218.197.147.24/api',
  // baseURL: 'http://47.106.170.165:8575',
  baseURL: 'https://www.krl.cool/fwxz-backend',
  // baseURL: 'http://localhost:8575',
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true // 允许携带cookies
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    console.log(res)
    // token失效
    if (res.code === 402) {
      removeToken()
      removeId()
      removeType()
      removeName()
      Message({
        type: 'info',
        message: '登录过期,请重新登录'
      })
      router.push('/login')
      return
    }
    return res
  },
  error => {
    // debugger
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      // message:"网络错误",
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
