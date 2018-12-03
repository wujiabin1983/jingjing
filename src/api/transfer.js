import fetch from '@/utils/fetch'

/**
 * 模板管理
 */
// 穿梭框数据
export function showTransfer(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'Transfer.json',
        method: 'get',
        data: result
    })
}
