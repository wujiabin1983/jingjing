import fetch from '@/utils/fetch'

/**
 * 商户用户管理
 */
// 显示表格数据
export function selectUserInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_105.action',
        method: 'post',
        data: result
    })
}
// 添加表格数据
export function selectUserInfoAdd(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_106.action',
        method: 'post',
        data: result
    })
}
// 编辑表格数据
export function selectUserInfoEdit(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_107.action',
        method: 'post',
        data: result
    })
}

// 删除表格数据
export function selectUserInfoDelete(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_108.action',
        method: 'post',
        data: result
    })
}
// 激活
export function selectUserInfoActive(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_109.action',
        method: 'post',
        data: result
    })
}
// 停用
export function selectUserInfoStop(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_110.action',
        method: 'post',
        data: result
    })
}