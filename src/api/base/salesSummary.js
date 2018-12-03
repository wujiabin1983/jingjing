import fetch from '@/utils/fetch'

/**
 * 数据导入-销售汇总
 */
// 显示导入页面的表格数据
export function importSalesSummary(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_308.action',
        method: 'post',
        data: result
    })
}
