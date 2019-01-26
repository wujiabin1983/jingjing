import fetch from '@/utils/fetch'

//回复图文预览
export function graphicPush(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_657.action',
        method: 'post',
        data: result
    })
}


//微信图文预览
export function graphicWechatPush(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_1048.action',
        method: 'post',
        data: result
    })
}