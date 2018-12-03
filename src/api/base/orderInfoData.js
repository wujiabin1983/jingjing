import fetch from '@/utils/fetch'

/**
 * 订单信息-销售商品明细
 */
// 显示表格数据
//订单明细
export function selectOrderDetail(data) {
//	console.log(data)
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_119.action',
        method: 'post',
        data: result
    })
}