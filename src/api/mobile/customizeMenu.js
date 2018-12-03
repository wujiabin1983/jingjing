import fetch from '@/utils/fetch'


// 自定义菜单 - 查询
export function customizeMenuShow(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_344.action',
        method: 'POST',
        data: result
    })
}

// 自定义菜单 - 保存菜单
export function customizeMenuAdd(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_691.action',
        method: 'POST',
        data: result
    })
}

// 自定义菜单 - 发布
export function customizeMenuEdit(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_346.action',
        method: 'POST',
        data: result
    })
}

// 自定义菜单 - 选择品牌
export function customizeSelect(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_343.action',
        method: 'POST',
        data: result
    })
}