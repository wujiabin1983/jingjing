import fetch from '@/utils/fetch'

/**
 * 营销活动 - 微信粉丝
 */
// 查询微信粉丝-关注统计-昨日关键指标
export function selectWeChatFans(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_672.action',
        method: 'post',
        data: result
    })
}

// 查询微信粉丝-关注统计-趋势图
export function selectWeChatFansData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_673.action',
        method: 'post',
        data: result
    })
}

// 查询微信粉丝-关注统计-数据详情
export function selectWeChatFansDataInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_674.action',
        method: 'post',
        data: result
    })
}

// 查询微信粉丝-关注统计-数据详情-导出
export function ImportWeChatFans(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_675.action',
        method: 'post',
        data: result
    })
}

// 查询微信粉丝-关注统计-粉丝来源分析
export function selectWeChatFansDataAnalyse(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_676.action',
        method: 'post',
        data: result
    })
}

// 查询未领卡粉丝
export function selectWeChatFansNoData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_677.action',
        method: 'post',
        data: result
    })
}