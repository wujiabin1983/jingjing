import fetch from '@/utils/fetch'

/**
 * 优惠券- 优惠券信息
 */
// 显示表格数据
export function selectCouponPackage(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_122.action',
        method: 'post',
        data: result
    })
}
// 显示表格数据
export function selectCouponPackageJurisdiction(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_122_01.action',
        method: 'post',
        data: result
    })
}

// 新增优惠券礼包 
export function addCouponPackage(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_123.action',
        method: 'post',
        data: result
    })
}
// 修改优惠券礼包 
export function setCouponPackage(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_124.action',
        method: 'post',
        data: result
    })
}
// 启用优惠券礼包 
export function couponPackageBegin(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_384.action',
        method: 'post',
        data: result
    })
}

// 禁用优惠券礼包 
export function couponLibraryStop(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_125.action',
        method: 'post',
        data: result
    })
}