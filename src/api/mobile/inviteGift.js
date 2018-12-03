import fetch from '@/utils/fetch'

// 显示
export function inviteGiftShow(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_264.action',
        method: 'post',
        data: result
    })
}
// 显示邀请记录
export function inviteGiftInfoShow(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_268.action',
        method: 'post',
        data: result
    })
}
// 添加
export function inviteGiftAdd(data) {
    const result = Base64.encode(JSON.stringify(data))
//  console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_265.action',
        method: 'post',
        data: result
    })
}
// 修改状态
export function inviteGiftChangeStatus(data) {
    const result = Base64.encode(JSON.stringify(data))
//  console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_267.action',
        method: 'post',
        data: result
    })
}

// 修改
export function inviteGiftEdit(data) {
    const result = Base64.encode(JSON.stringify(data))
//  console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_266.action',
        method: 'post',
        data: result
    })
}
