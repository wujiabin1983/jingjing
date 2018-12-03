import fetch from '@/utils/fetch'

/**
 * 自动打标签
 */
// 显示表格数据
export function selectAutomaticMarking(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_363.action',
        method: 'post',
        data: result
    })
}
// 新增表格数据
export function addAutomaticMarking(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_365.action',
        method: 'post',
        data: result
    })
}
// 修改表格数据
export function setAutomaticMarking(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_366.action',
        method: 'post',
        data: result
    })
}
// 停止表格数据
export function stopAutomaticMarking(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_367.action',
        method: 'post',
        data: result
    })
}
// 删除表格数据
export function deleteAutomaticMarking(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_364.action',
        method: 'post',
        data: result
    })
}
