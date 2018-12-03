import fetch from '@/utils/fetch'

/**
 * 模板管理 - 活动对象 - 预置分组
 */
// 显示表格数据
export function selectPresetGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'templateInfoTwoShowTable.json',
        method: 'get',
        data: result
    })
}
