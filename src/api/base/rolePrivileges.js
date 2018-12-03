import fetch from '@/utils/fetch'

/**
 * 员工管理 - 角色权限
 */
// 显示表格数据
export function selectRoleData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_328.action',
        method: 'post',
        data: result
    })
}
//添加
export function addRoleInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_329.action',
        method: 'post',
        data: result
    })
}
//修改
export function setRoleInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_330.action',
        method: 'post',
        data: result
    })
}

//删除
export function deleteRoleInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_331.action',
        method: 'post',
        data: result
    })
}

// 查看权限
export function showDropDownTree(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: 'rolePrivilegesSetShow.json',
        method: 'get',
        data: result
    })
}
// 设置权限
export function editDropDownTree(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: 'rolePrivilegesSetEdit.json',
        method: 'get',
        data: result
    })
}
// 获取权限信息
export function getDropDownTreeInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_621.action',
        method: 'post',
        data: result
    })
}
// 查看详情信息
export function getDataInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_646.action',
        method: 'post',
        data: result
    })
}
// 查看详情信息
export function setRolePrivileges(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_622.action',
        method: 'post',
        data: result
    })
}
// 查看详情信息APP
export function getDropDownTreeInfoAPP(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_147.action',
        method: 'post',
        data: result
    })
}
//修改
export function setRoleInfoAPP(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_148.action',
        method: 'post',
        data: result
    })
}
