import fetch from '@/utils/fetch'



//请求左侧导航
export function getRouterLink(data) {
    let result = Base64.encode(JSON.stringify(data));
//  console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_660.action',
        method: 'post',
        data: result
    })
}
