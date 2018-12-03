import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'transaction.json',
    method: 'get',
    params: query
  })
}
