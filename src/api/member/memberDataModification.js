import fetch from '@/utils/fetch'

export function selectMemberData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_420.action',
        method: 'post',
        data: result
    })
}

export function setMemberData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_421.action',
        method: 'post',
        data: result
    })
}

export function selectMemberInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_422.action',
        method: 'post',
        data: result
    })
}