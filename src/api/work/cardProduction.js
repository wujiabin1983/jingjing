import fetch from '@/utils/fetch'

/**
 * 工作管理  - 营销助手 - 工牌制作
 */
// 显示表格数据
export function selectCardProduction(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_650.action',
        method: 'post',
        data: result
    })
}
// 工牌下载
export function cardProductionDownlaod(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_655.action',
        method: 'post',
        data: result
    })
}
//制作导购二维码
export function cardProductionShop(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_651.action',
        method: 'post',
        data: result
    })
}
//制作门店二维码
export function cardProductionStore(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_652.action',
        method: 'post',
        data: result
    })
}
