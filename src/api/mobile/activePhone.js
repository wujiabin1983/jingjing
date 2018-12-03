import fetch from '@/utils/fetch'


// 激活手机查询
export function activePhoneShow(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_828.action',
        method: 'POST',
        data: result
    })
}
// 激活手机设置
export function activePhoneEdit(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_826.action',
        method: 'POST',
        data: result
    })
}