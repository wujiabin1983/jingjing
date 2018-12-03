import fetch from '@/utils/fetch'

/**
 * 营销活动 - 活动管理
 */
// 查询营销活动短信发送记录信息
export function selectMessageData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_765.action',
        method: 'post',
        data: result
    })
}
// 根据短信模板查询营销活动短信发送记录信息
export function messageDataInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_766.action',
        method: 'post',
        data: result
    })
}

//根据短信模板,发送时间查询营销活动短信发送记录信息
export function messageData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_767.action',
        method: 'post',
        data: result
    })
}
