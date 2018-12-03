import fetch from '@/utils/fetch'

// 查询商户用户组信息 √
export function selectSellerUserGroupInfo(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_028.action',
    method: 'post',
    data: result
  })
}

// 添加商户用户组信息 √
export function addSellerUserGroupInfo(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_029.action',
    method: 'post',
    data: result
  })
}

// 修改商户用户组信息  √
export function updateSellerUserGroupInfo(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_030.action',
    method: 'post',
    data: result
  })
}

// 删除商户用户组信息  √
export function deleteSellerUserGroupInfo(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_031.action',
    method: 'post',
    data: result
  })
}
