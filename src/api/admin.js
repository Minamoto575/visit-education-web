import request from '@/utils/request'
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

function changePasswod(data) {
    return request({
        url: BaseUrl + '/changePassword',
        method: 'post',
        data
    })
}

export default {
    login,
    logout,
    register,
    changePasswod,
}