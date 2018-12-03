import fetch from '@/utils/fetch'

/**
 * 营销活动 - 活动管理
 */
// 查询活动列表表格数据
export function selectTemplateData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_314.action',
        method: 'post',
        data: result
    })
}
// 查看详情活动列表表格数据
export function selectTemplateInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_318.action',
        method: 'post',
        data: result
    })
}
// 活动列表新建活动
export function creatTemplateData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_315.action',
        method: 'post',
        data: result
    })
}
// 活动列表修改活动
export function setTemplateData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_316.action',
        method: 'post',
        data: result
    })
}

// 活动列表删除活动
export function deleteData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_317.action',
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
//活动管理新建活动-短信模板
export function selectMessageInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_635.action',
        method: 'post',
        data: result
    })
}
