import fetch from '@/utils/fetch'

/**
 * 营销工具 - 门店摇一摇 - 活动管理
 */
// 查询活动列表表格数据
export function selectActivityData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_745.action',
        method: 'post',
        data: result
    })
}
// 查看详情活动列表表格数据
export function selectActivityInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_747.action',
        method: 'post',
        data: result
    })
}
// 活动列表新建活动
export function creatActivityData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_746.action',
        method: 'post',
        data: result
    })
}
// 活动列表修改活动
export function setActivityData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_748.action',
        method: 'post',
        data: result
    })
}

// 活动列表删除活动
export function deleteData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_749.action',
        method: 'post',
        data: result
    })
}
