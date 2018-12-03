import fetch from '@/utils/fetch'

/**
 * 营销活动 - 活动管理
 */
// 查询活动列表表格数据
export function selectActivityData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_814.action',
        method: 'post',
        data: result
    })
}
// 查看详情活动列表表格数据
export function selectActivityInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_815.action',
        method: 'post',
        data: result
    })
}
// 查询审核列表表格数据
export function selectAudioData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_427.action',
        method: 'post',
        data: result
    })
}
// 活动列表新建活动
export function creatActivityData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_615.action',
        method: 'post',
        data: result
    })
}
// 活动列表修改活动
export function setActivityData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_816.action',
        method: 'post',
        data: result
    })
}

// 活动列表开启活动
export function BeginData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_819.action',
        method: 'post',
        data: result
    })
}
// 活动列表暂停活动
export function stopData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_818.action',
        method: 'post',
        data: result
    })
}
// 活动列表删除活动
export function deleteData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_817.action',
        method: 'post',
        data: result
    })
}
// 审核列表通过按钮
export function audioYesData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_428.action',
        method: 'post',
        data: result
    })
}
// 审核列表驳回按钮
export function audioNoData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_429.action',
        method: 'post',
        data: result
    })
}
//活动管理预置分组查询-添加/修改
export function selectPresetGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_423.action',
        method: 'post',
        data: result
    })
}
//活动管理新建活动-短信模板-下拉
export function selectMessageInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_635.action',
        method: 'post',
        data: result
    })
}
//活动管理新建活动-短信模板-模板内容
export function selectMessageInfoContent(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_690.action',
        method: 'post',
        data: result
    })
}
