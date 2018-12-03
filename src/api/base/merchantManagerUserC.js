import fetch from '@/utils/fetch'

// 系统设置 - 业务规则 - 会员权益显示
export function privilegeShow(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTER_FACE_201.action',
        method: 'post',
        data: result
    })
}
// 系统设置 - 业务规则 - 会员权益添加
export function privilegeAdd(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTER_FACE_202.action',
        method: 'post',
        data: result
    })
}
// 系统设置 - 业务规则 - 等级 - 品牌 -查询
export function selectBrandLeval(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_665.action',
        method: 'post',
        data: result
    })
}
// 系统设置 - 业务规则 - 等级 - 品牌 -新增
export function addBrandLeval(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_666.action',
        method: 'post',
        data: result
    })
}
// 系统设置 - 业务规则 - 等级 - 品牌 -修改
export function setBrandLeval(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_667.action',
        method: 'post',
        data: result
    })
}
// 系统设置 - 业务规则 - 等级 - 品牌 -删除
export function deleteBrandLeval(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_668.action',
        method: 'post',
        data: result
    })
}



