import request from '@/utils/request'

const BaseUrl = '/record'

function deleteRecord(id) {
  return request({
    url: BaseUrl + '/delete',
    method: 'delete',
    params: { id }
  })
}

function postRecord(data) {
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

function listSubjects(data) {
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

function uploadExcel(data, doCheck) {
  return request({
    url: BaseUrl + '/upload/excel',
    method: 'post',
    contentType: false,
    processData: false,
    params: { doCheck },
    data: data
  })
}

function listAll(data) {
  return request({
    url: BaseUrl + '/search/all',
    method: 'post',
    data: data
  })
}

function deleteBatch(data) {
  return request({
    url: BaseUrl + '/delete/combination',
    method: 'post',
    data: data
  })
}

export default {
  deleteRecord,
  postRecord,
  searchByTeacherName,
  searchAll,
  searchByCombination,
  listProjects,
  listSchools,
  listSubjects,
  updateRecord,
  uploadExcel,
  listAll,
  deleteBatch
}
