import fetch from '@/utils/fetch'

/**
 * 营销工具 - 积分商城 - 积分兑礼
 */
// 积分兑礼-礼品列表-分页及详情查询
export function selectRitualData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_636.action',
        method: 'post',
        data: result
    })
}

// 积分兑礼审核-礼品审核列表-分页及详情查询
export function selectRitualDataAudit(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_636_1.action',
        method: 'post',
        data: result
    })
}

// 积分兑礼审核-礼品审核列表-通过请求
export function AuditYesData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_636_2.action',
        method: 'post',
        data: result
    })
}

// 积分兑礼审核-礼品审核列表-驳回请求
export function AuditNoData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_636_2.action',
        method: 'post',
        data: result
    })
}



// 查询订单管理列表表格数据
export function selectOrderData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_641.action',
        method: 'post',
        data: result
    })
}
// 活动列表新建礼品
export function creatRitualData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_637.action',
        method: 'post',
        data: result
    })
}
// 活动列表修改礼品
export function setRitualData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_638.action',
        method: 'post',
        data: result
    })
}

// 活动列表启用礼品
export function beginRitual(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_639.action',
        method: 'post',
        data: result
    })
}

// 活动列表禁用礼品
export function stopRitual(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_640.action',
        method: 'post',
        data: result
    })
}
// 订单列表导出
export function exportData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_670.action',
        method: 'post',
        data: result
    })
}

// 生成复制链接二维码
export function creatRitualQrcode(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_671.action',
        method: 'post',
        data: result
    })
}
