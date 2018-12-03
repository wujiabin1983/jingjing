import fetch from '@/utils/fetch'

/**
 * 工作管理  - 营销助手 - 分配专属导购
 */
// 显示表格数据
export function selectDistributeShop(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_647.action',
        method: 'post',
        data: result
    })
}
// 分配导购
export function serDistribute(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_649.action',
        method: 'post',
        data: result
    })
}
