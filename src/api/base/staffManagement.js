import fetch from '@/utils/fetch'

/**
 * 员工管理- 员工管理
 */
// 显示表格数据
export function selectStaffManagement(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_609.action',
        method: 'post',
        data: result
    })
}
//添加员工
export function addStaffManagement(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_610.action',
        method: 'post',
        data: result
    })
}
//修改员工
export function setStaffManagement(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_611.action',
        method: 'post',
        data: result
    })
}
//删除员工	I_SCRM_INTERFACE_802
export function delectStaffManagement(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_802.action',
        method: 'post',
        data: result
    })
}
//权限分配员工	I_SCRM_INTERFACE_508
export function jurisdictionStaff(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_508.action',
        method: 'post',
        data: result
    })
}
//登录变更	I_SCRM_INTERFACE_801
export function setLoginF(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_801.action',
        method: 'post',
        data: result
    })
}
//变更获取验证码	I_SCRM_INTERFACE_620
export function getVerification(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_620.action',
        method: 'post',
        data: result
    })
}
//导出
export function exportData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_803.action',
        method: 'post',
        data: result
    })
}

//新增员工检查登录账号是否存在	I_SCRM_INTERFACE_612
export function isLoginId(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_612.action',
        method: 'POST',
        data: result
    })
}
// 显示导入页面的表格数据
export function importStaffManagement(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_408.action',
        method: 'post',
        data: result
    })
}

// 查询所属品牌
export function selectBrand(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_340.action',
        method: 'post',
        data: result
    })
}
