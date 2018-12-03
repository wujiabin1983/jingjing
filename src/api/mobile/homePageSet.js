import fetch from '@/utils/fetch'

// 显示(上) -- ok
export function homePageSetShow(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_627.action',
        method: 'post',
        data: result
    })
}

// 保存(上) -- ok
export function homePageSetSave(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_629.action',
        method: 'post',
        data: result
    })
}

// 显示(下) -- ok
export function homePageSetShow2(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_628.action',
        method: 'post',
        data: result
    })
}

// 新增(下) -- ok
export function homePageSetSave2(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_630.action',
        method: 'post',
        data: result
    })
}

// 修改(下) -- ok
export function homePageSetEdit2(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_631.action',
        method: 'post',
        data: result
    })
}

// 删除(下) 
export function homePageSetDelete2(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_632.action',
        method: 'post',
        data: result
    })
}
