import fetch from '@/utils/fetch'

/**
 * 优惠券- 门店券库
 */
// 显示表格数据
export function selectStoreVoucherLibrary(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_715.action',
        method: 'post',
        data: result
    })
}
// 显示表格数据
export function selectStoreVoucherLibraryJurisdiction(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_715_01.action',
        method: 'post',
        data: result
    })
}
//查看详情
export function storeVoucherLibraryInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_716.action',
        method: 'post',
        data: result
    })
}
// 新增门店券
export function addStoreVoucherLibrary(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_717.action',
        method: 'post',
        data: result
    })
}
// 启用门店券
export function StoreVoucherLibraryYes(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_719.action',
        method: 'post',
        data: result
    })
}
// 停止门店券
export function StoreVoucherLibraryNo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_718.action',
        method: 'post',
        data: result
    })
}

// 新增门店券 - 显示数据
export function storeVoucherLibraryShow(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/member/storeVoucherLibraryShow.json',
        method: 'get',
        data: result
    })
}
