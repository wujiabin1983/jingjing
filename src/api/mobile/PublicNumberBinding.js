import fetch from '@/utils/fetch'

// 分组列表 - 显示
export function PublicNumberBindingShow(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_633.action',
        method: 'POST',
        data: result
    })
}

// 分组列表 - 取消绑定
export function PublicNumberBindingCancel(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_634.action',
        method: 'POST',
        data: result
    })
}

// 二维码扫描回调
export function qrcode(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_669.action',
        method: 'POST',
        data: result
    })
}


