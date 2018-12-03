import fetch from '@/utils/fetch'


// 查看
export function selectTemplate(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_679.action',
        method: 'POST',
        data: result
    })
}

//修改
export function setTemplate(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_681.action',
        method: 'POST',
        data: result
    })
}

//启用/停用
export function statusTemplate(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_682.action',
        method: 'POST',
        data: result
    })
}
