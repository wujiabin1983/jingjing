import fetch from '@/utils/fetch'

/**
 * 营销工具 - 门店送券
 */
// 查询活动列表表格数据
export function selectstoreVoucherData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_359.action',
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
export function addStoreVoucherData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_356.action',
        method: 'post',
        data: result
    })
}
// 活动列表修改活动
export function setStoreVoucherData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_357.action',
        method: 'post',
        data: result
    })
}

// 活动列表删除活动
export function deleteData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_358.action',
        method: 'post',
        data: result
    })
}
