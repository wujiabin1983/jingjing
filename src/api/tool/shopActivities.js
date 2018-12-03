import fetch from '@/utils/fetch'

/**
 * 营销工具 - 门店活动详情 - 门店活动
 */
// 查询活动列表表格数据
export function selectShopActivitiesData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_834.action',
        method: 'post',
        data: result
    })
}
// 活动列表新建活动
export function creatShopActivitiesData2(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_835.action',
        method: 'post',
        data: result
    })
}
// 活动列表修改活动
export function setShopActivitiesData2(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_836.action',
        method: 'post',
        data: result
    })
}

// 活动列表删除活动
export function deleteData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_837.action',
        method: 'post',
        data: result
    })
}

// 新增门店活动-发送短信
export function pushSMS(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_839.action',
        method: 'post',
        data: result
    })
}

