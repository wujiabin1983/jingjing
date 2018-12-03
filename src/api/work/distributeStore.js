import fetch from '@/utils/fetch'

/**
 * 工作管理  - 营销助手 - 分配服务门店
 */
// 显示表格数据
export function selectDistributeStore(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_653.action',
        method: 'post',
        data: result
    })
}
// 分配导购
export function distributeStore(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_654.action',
        method: 'post',
        data: result
    })
}
