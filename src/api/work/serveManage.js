import fetch from '@/utils/fetch'

/**
 * 工作管理  - 营销助手 - 工牌制作
 */
// 显示表格数据
export function selectserveData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_386.action',
        method: 'post',
        data: result
    })
}
// 回复服务申请
export function replyServeApply(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_387.action',
        method: 'post',
        data: result
    })
}

// 查询申请类型
export function selectApplyType(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_388.action',
        method: 'post',
        data: result
    })
}

// 添加申请类型
export function addApplyType(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_389.action',
        method: 'post',
        data: result
    })
}
// 修改申请类型
export function setApplyType(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_390.action',
        method: 'post',
        data: result
    })
}
// 删除申请类型
export function deleteApplyType(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_391.action',
        method: 'post',
        data: result
    })
}

// 申请类型下拉框
export function selectApplyTypes(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_399.action',
        method: 'post',
        data: result
    })
}
