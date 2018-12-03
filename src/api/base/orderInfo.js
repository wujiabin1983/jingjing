import fetch from '@/utils/fetch'

/**
 * 订单信息-销售信息
 */
// 显示表格数据
export function selectOrderInfo(data) {
//	console.log(data)
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_118.action',
        method: 'post',
        data: result
    })
}

