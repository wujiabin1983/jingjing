import fetch from '@/utils/fetch'


// 查看
export function selectAutoRespond(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_260.action',
        method: 'POST',
        data: result
    })
}

// 新增
export function addAutoRespond(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_261.action',
        method: 'POST',
        data: result
    })
}

//修改
export function editAutoRespond(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_262.action',
        method: 'POST',
        data: result
    })
}

//删除
export function deleteAutoRespond(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_263.action',
        method: 'POST',
        data: result
    })
}
