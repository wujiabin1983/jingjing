import fetch from '@/utils/fetch'

/**
 * 权限分配
 */
// 显示表格数据
export function selectInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: 'I_SCRM_INTERFACE_135.action',
        method: 'post',
        data: result
    })
}

// 查看权限
export function showDropDownTree(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: 'I_SCRM_INTERFACE_103.action',
        method: 'post',
        data: result
    })
}
// 设置权限
export function editDropDownTree(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: 'I_SCRM_INTERFACE_104.action',
        method: 'post',
        data: result
    })
}

// 商户用户组下拉
export function sellerGroupCombox(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: 'I_SCRM_INTERFACE_140.action',
        method: 'post',
        data: result
    })
}

// 设置勾选项
export function setTreeSelected(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: 'I_SCRM_INTERFACE_143.action',
        method: 'post',
        data: result
    })
}




