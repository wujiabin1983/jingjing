import fetch from '@/utils/fetch'

// 显示
export function selectMember(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_737.action',
        method: 'post',
        data: result
    })
}

// 新增
export function addMember(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_738.action',
        method: 'post',
        data: result
    })
}

// 修改
export function editMember(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_739.action',
        method: 'post',
        data: result
    })
}
