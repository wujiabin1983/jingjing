import fetch from '@/utils/fetch'

/**
 * 系统设置 - 业务规则 - 会员权益
 */
// 获取积分
export function selectMerChantBase(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_053.action',
        method: 'post',
        data: result
    })
}

// 保存积分
export function addMerChantBase(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_054.action',
        method: 'post',
        data: result
    })
}

// 保存积分
export function setMerChantBase(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_055.action',
        method: 'post',
        data: result
    })
}

// 保存积分
export function deleteMerChantBase(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_056.action',
        method: 'post',
        data: result
    })
}
