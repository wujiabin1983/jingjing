import fetch from '@/utils/fetch'

export function login(userInfo) {
  let result = Base64.encode(JSON.stringify(userInfo))
  return fetch({
    // url: '/user/login',
    url: '/I_SCRM_INTERFACE_001.action',
    method: 'post',
    data: result
  })
}

export function selectAccount(accountInfo) {
  let result = Base64.encode(JSON.stringify(accountInfo));
  return fetch({
    // url: '/user/login',
    url: '/I_SCRM_INTERFACE_002.action',
    method: 'post',
    data: result
  })
}

export function getCode(moblie) {
  let result = Base64.encode(JSON.stringify(moblie));
  return fetch({
    url: '/I_SCRM_INTERFACE_004.action',
    method: 'post',
    data: result
  })
}

export function getInfo(token) {
  return fetch({
    url: '/user/info.action',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return fetch({
    url: '/userLogout.action',
    method: 'post'
  })
}


export function test() {
  return fetch({
    url: '/executeShipInfo.action',
    method: 'post'
  })
}

export function forgotPass(data) {
  let result = Base64.encode(JSON.stringify(data));
  return fetch({
    url: '/I_SCRM_INTERFACE_003.action',
    method: 'post',
    data: result
  })
}

export function cutAccount(data) {
  let result = Base64.encode(JSON.stringify(data));
  return fetch({
    url: '/I_SCRM_INTERFACE_001_01.action',
    method: 'post',
    data: result
  })
}

