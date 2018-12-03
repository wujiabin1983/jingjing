import fetch from '@/utils/fetch'

// 查询商户信息 √
export function selectSellerInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_022.action',
        method: 'post',
        data: result
    })
}

// 查询商户信息  没权限√
export function selectSellerInfoJust(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_022_01.action',
        method: 'post',
        data: result
    })
}

// 注册商户信息 √
export function addSellerInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_023.action',
        method: 'post',
        data: result
    })
}

// 修改商户信息 √
export function updateSellerInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_024.action',
        method: 'post',
        data: result
    })
}

// 删除商户信息 √
export function deleteSellerInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_025.action',
        method: 'post',
        data: result
    })
}

// 启用商户信息 √
export function activeSellerInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_026.action',
        method: 'post',
        data: result
    })
}

// 停用商户信息 √
export function inactiveSellerInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_027.action',
        method: 'post',
        data: result
    })
}

// 上传还未好