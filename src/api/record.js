import request from '@/utils/request'

const BaseUrl = '/record'

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

function searchByTeacherName(data) {
    return request({
        url: BaseUrl + '/search/teacher',
        method: 'post',
        data
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

function listSchools(data) {
    return request({
        url: BaseUrl + '/search/school',
        method: 'post',
        data
    })
}

function listSujects(data) {
    return request({
        url: BaseUrl + '/search/subject',
        method: 'post',
        data
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
        contentType:false,
        processData:false,
        data: data
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