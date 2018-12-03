import fetch from '@/utils/fetch'

/**
 * 日志管理
 */
// 显示表格数据
export function selectLogInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
    // return fetch({
        url: 'I_SCRM_INTERFACE_757.action',
        method: 'post',
        data: result
    })
}

// 查看详情数据
export function logInfoData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
    // return fetch({
        url: 'I_SCRM_INTERFACE_758.action',
        method: 'post',
        data: result
    })
}

// 查询日志类型
export function selectLogType(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
    // return fetch({
        url: 'I_SCRM_INTERFACE_759.action',
        method: 'post',
        data: result
    })
}

// 导出日志信息
export function improtData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
    // return fetch({
        url: 'I_SCRM_INTERFACE_760.action',
        method: 'post',
        data: result
    })
}

