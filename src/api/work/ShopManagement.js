import fetch from '@/utils/fetch'

/**
 * 工作管理  - 营销助手 - 导购管理
 */
// 显示表格数据
export function selectStoreManagement(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_643.action',
        method: 'post',
        data: result
    })
}
// 显示表格数据
export function selectStoreManagementShop(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_643_01.action',
        method: 'post',
        data: result
    })
}
// 设为营销导购
export function marketingEnvironment(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_644.action',
        method: 'post',
        data: result
    })
}
//离职
export function dimission(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_645.action',
        method: 'post',
        data: result
    })
}
