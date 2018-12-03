import fetch from '@/utils/fetch'


// 立即绑定
export function bindMembershipCardBinding(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_825.action',
        method: 'POST',
        data: result
    })
}
// 立即绑定查询
export function bindMembershipCardShow(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_829.action',
        method: 'POST',
        data: result
    })
}