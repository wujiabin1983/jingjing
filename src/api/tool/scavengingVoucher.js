import fetch from '@/utils/fetch'

/**
 * 营销工具 - 扫码领券 
 */
// 扫码领券查询
export function selectScavengingVoucherData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_354.action',
        method: 'post',
        data: result
    })
}
// 扫码领券新建
export function creatScavengingVoucherData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_352.action',
        method: 'post',
        data: result
    })
}
// 扫码领券修改
export function setScavengingVoucherData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_353.action',
        method: 'post',
        data: result
    })
}


// 启用
export function scavengingVoucherBegin(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_374.action',
        method: 'post',
        data: result
    })
}

// 禁用
export function scavengingVoucherStop(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_355.action',
        method: 'post',
        data: result
    })
}

// 禁用
export function scavengingVoucherCopyLink(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_678.action',
        method: 'post',
        data: result
    })
}