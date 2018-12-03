import fetch from '@/utils/fetch'

// 微信会员卡 - 显示
export function WeChatMembershipCardShow(data) {
    const result = Base64.encode(JSON.stringify(data))
//  console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_830.action',
        method: 'POST',
        data: result
    })
}
// 微信会员卡 - 显示下拉菜单
export function dropDownShow(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_381_01.action',
        method: 'POST',
        data: result
    })
}

// 微信会员卡 - 设置
export function WeChatMembershipCardEdit(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_831.action',
        method: 'POST',
        data: result
    })
}

// 微信会员卡 - 上传logo
export function WeChatMembershipCardLogo(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_832.action',
        method: 'POST',
        data: result
    })
}
// 微信会员卡 - 上传卡券封面
export function WeChatMembershipCardCardPicture(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_833.action',
        method: 'POST',
        data: result
    })
}

// 保存并提交到微信
export function WeChatMembershipCardPush(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_659.action',
        method: 'POST',
        data: result
    })
}

// 显示会员等级
export function selectLevel(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_601.action',
        method: 'POST',
        data: result
    })
}
