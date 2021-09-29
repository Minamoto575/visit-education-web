import request from '@/utils/request-backend'
import axios from 'axios'

const BaseUrl = '/admin'

function login(data) {
    return request({
        url: BaseUrl + '/login',
        method: 'post',
        data
    })
}

function logout() {
    return request({
        url: BaseUrl + '/logout',
        method: 'get',
    })
}

function register(data) {
    return request({
        url: BaseUrl + '/register',
        method: 'post',
        data
    })
}

export default {
    login,
    logout,
    register
}