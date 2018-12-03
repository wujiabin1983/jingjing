import fetch from '@/utils/fetch'

export function graphicPush(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_657.action',
        method: 'post',
        data: result
    })
}