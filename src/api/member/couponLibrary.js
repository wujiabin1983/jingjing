import fetch from '@/utils/fetch'

/**
 * 优惠券- 优惠券信息
 */
// 显示表格数据
export function selectCouponLibrary(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_701.action',
        method: 'post',
        data: result
    })
}
// 显示表格数据-没权限
export function selectCouponLibraryJurisdiction(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_701_01.action',
        method: 'post',
        data: result
    })
}
//显示审核数据
export function selectAudioCouponLibrary(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_702.action',
        method: 'post',
        data: result
    })
}
// 新增优惠券模板 
export function addCouponLibrary(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_704.action',
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
// 通过优惠券信息
export function couponLibraryAudioYes(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_707.action',
        method: 'post',
        data: result
    })
}
// 驳回优惠券信息
export function couponLibraryAudioNo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_708.action',
        method: 'post',
        data: result
    })
}

// 启用优惠券信息
export function couponLibraryBegin(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_706.action',
        method: 'post',
        data: result
    })
}

// 禁用优惠券信息
export function couponLibraryStop(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_705.action',
        method: 'post',
        data: result
    })
}
// 修改优惠券信息
export function setCouponLibrary(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_709.action',
        method: 'post',
        data: result
    })
}