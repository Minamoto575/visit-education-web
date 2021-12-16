import request from '@/utils/request'

export function postNotice(content) {
  return request({
    url: '/notice/post',
    method: 'post',
    params: { content }
  })
}

export function getLatestNotice() {
  return request({
    url: '/notice/getLatest',
    method: 'get'
  })
}

export default {
  postNotice,
  getLatestNotice
}
