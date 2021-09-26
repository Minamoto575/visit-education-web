import request from '@/utils/request'

const BaseUrl = 'localhost:8080/record'

function deleteRecord(id) {
    return request({
        url: BaseUrl + '/delete',
        method: 'delete',
        params: { id }
    })
}

function postRecrod(data) {
    return request({
        url: BaseUrl + '/post',
        method: 'post',
        data
    })
}

function searchByTeacherName(name) {
    return request({
        url: BaseUrl + '/search',
        method: 'get',
        params: {name}
    })
}

function searchAll() {
    return request({
        url: BaseUrl + '/search/all',
        method: 'get'
    })
}

function searchByCombination(data) {
    return request({
        url: BaseUrl + '/search/combination',
        method: 'post',
        data
    })
}

function listProjects() {
    return request({
        url: BaseUrl + '/search/project',
        method: 'get'
    })
}

function listSchools(subject) {
    return request({
        url: BaseUrl + '/search/school',
        method: 'get',
        params: {subject}
    })
}

function listSujects(subject,school) {
    return request({
        url: BaseUrl + '/search/subject',
        method: 'get',
        params: {subject}&{school}
    })
}

function updateRecord(data) {
    return request({
        url: BaseUrl + '/update',
        method: 'put',
        data
    })
}

function uploadExcel(data){
    return request({
        url: BaseUrl + '/upload/excel',
        method: 'post',
        data
    })
}

export default {
    deleteRecord,
    postRecrod,
    searchByTeacherName,
    searchAll,
    searchByCombination,
    listProjects,
    listSchools,
    listSujects,
    updateRecord,
    uploadExcel
}