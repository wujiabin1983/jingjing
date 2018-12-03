import fetch from '@/utils/fetch'

/**
 * 营销活动 - 活动管理
 */
// 查询活动列表表格数据
export function selectActivityInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_725.action',
        method: 'post',
        data: result
    })
}
// 查询审核列表表格数据
export function selectActivityViewData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_726.action',
        method: 'post',
        data: result
    })
}
