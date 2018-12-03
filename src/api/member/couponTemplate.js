import fetch from '@/utils/fetch'

/**
 * 优惠券- 优惠券模板
 */
// 显示表格数据
export function selectCouponTemplate(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_423.action',
        method: 'post',
        data: result
    })
}
// 新增优惠券模板
export function addCouponTemplate(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_426.action',
        method: 'post',
        data: result
    })
}
// 删除优惠券模板
export function deleteCouponTemplate(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_424.action',
        method: 'post',
        data: result
    })
}