import fetch from '@/utils/fetch'

/**
 * 会员标签
 */
// 显示表格数据
export function importMemberLabel(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_401.action',
        method: 'post',
        data: result
    })
}

// 添加
export function addMemberLabel(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_402.action',
        method: 'post',
        data: result
    })
}
// 修改
export function setMemberLabel(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_403.action',
        method: 'post',
        data: result
    })
}
// 删除
export function deleteMemberLabel(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_404.action',
        method: 'post',
        data: result
    })
}

// 会员标签导入数据查看详情
export function memberLabelDetail(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_616.action',
        method: 'post',
        data: result
    })
}
