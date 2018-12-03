import fetch from '@/utils/fetch'

/**
 * 营销工具 - 门店活动详情 - 门店活动  -短信统计
 */
// 查询活动短信统计列表表格数据
export function selectShortMessageStatistics(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_838.action',
        method: 'post',
        data: result
    })
}
// 查询活动短信统计列表表格数据-查看详情
export function selectShortMessageInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_840.action',
        method: 'post',
        data: result
    })
}
