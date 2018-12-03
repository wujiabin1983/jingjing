import fetch from '@/utils/fetch'

/**
 * 营销工具 - 门店摇一摇 - 活动管理
 */
// 查询活动列表表格数据
export function selectDeviceBindingData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_750.action',
        method: 'post',
        data: result
    })
}
// 活动列表新建活动
export function creatDeviceBindingData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_751.action',
        method: 'post',
        data: result
    })
}
// 活动列表修改活动
export function setDeviceBindingData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_753.action',
        method: 'post',
        data: result
    })
}

// 活动列表删除活动
export function deleteData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_754.action',
        method: 'post',
        data: result
    })
}

// 查询绑定列表
export function selectBindingInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_745_01.action',
        method: 'post',
        data: result
    })
}

// 绑定功能
export function BindingInfoFn(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_685.action',
        method: 'post',
        data: result
    })
}