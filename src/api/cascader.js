import fetch from '@/utils/fetch'

/**
 * 模板管理
 */
// 级联选择器
export function showCascader(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'cascaderInfo.json',
        method: 'get',
        data: result
    })
}
