import fetch from '@/utils/fetch'

/**
 * 常量管理
 */
// 显示表格数据
export function selectCommonManage(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_042.action',
        method: 'post',
        data: result
    })
}

// 新增常量信息 
export function addCommonManage(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_045.action',
        method: 'post',
        data: result
    })
}
// 修改常量信息 
export function setCommonManage(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_044.action',
        method: 'post',
        data: result
    })
}

// 删除常量信息
export function deleteCommonManage(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_043.action',
        method: 'post',
        data: result
    })
}

// 显示 常量组 下拉选项
export function showDownSelect(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_499.action',
        method: 'post',
        data: result
    })
}