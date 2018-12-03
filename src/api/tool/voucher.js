import fetch from '@/utils/fetch'

/**
 * 营销工具 - 积分商城 - 积分兑券
 */
// 积分兑券-积分兑换-分页及详情查询
export function selectVoucherData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_360.action',
        method: 'post',
        data: result
    })
}
// 查询审核列表表格数据
export function selectAudioData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_369.action',
        method: 'post',
        data: result
    })
}
// 活动列表新建礼品
export function creatVoucherData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_361.action',
        method: 'post',
        data: result
    })
}
// 活动列表修改礼品
export function setVoucherData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_371.action',
        method: 'post',
        data: result
    })
}
// 活动列表通过礼品
export function yesVoucherData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_370.action',
        method: 'post',
        data: result
    })
}
// 活动列表驳回礼品
export function noVoucherData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_376.action',
        method: 'post',
        data: result
    })
}
// 活动列表启用礼品
export function aduioVoucherBegin(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_375.action',
        method: 'post',
        data: result
    })
}
// 活动列表禁用礼品
export function aduioVoucherStop(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_362.action',
        method: 'post',
        data: result
    })
}
// 删除
export function deleteData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_372.action',
        method: 'post',
        data: result
    })
}
