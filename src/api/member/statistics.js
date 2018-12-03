import fetch from '@/utils/fetch'

/**
 * 优惠券 使用统计
 */
//查询
export function selectCouponStatistics(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_858.action',
        method: 'post',
        data: result
    })
}
// 查看详情
export function selectCouponStatisticsInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_859.action',
        method: 'post',
        data: result
    })
}
// 查看详情
export function selectCouponInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_860.action',
        method: 'post',
        data: result
    })
}
// 导出
export function exportData(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_861.action',
        method: 'post',
        data: result
    })
}
// 导出
export function exportDataInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_862.action',
        method: 'post',
        data: result
    })
}
