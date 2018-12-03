import fetch from '@/utils/fetch'

/**
 * 系统设置 - 业务规则 - 会员权益
 */
// 获取用户品牌信息 - 商户管理员/品牌管理员
// export function getPermissions(data) {
//     let result = Base64.encode(JSON.stringify(data))
//     return fetch({
//         url: 'merchantManagerUserPermissions.json',
//         method: 'get',
//         data: result
//     })
// }

// 获取积分
export function selectIntegralRuleInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_071.action',
        method: 'post',
        data: result
    })
}

// 保存积分
export function saveIntegralRuleInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_069.action',
        method: 'post',
        data: result
    })
}

// 修改积分
export function editIntegralRuleInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_070.action',
        method: 'post',
        data: result
    })
}
// 删除积分
export function deleteIntegralRuleInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_332.action',
        method: 'post',
        data: result
    })
}


// // 获取 scrm模式或者pos模式
// export function getModel(data) {
//     let result = Base64.encode(JSON.stringify(data))
//     return fetch({
//         url: 'POSorSCRM.json',
//         method: 'get',
//         data: result
//     })
// }

// 表格数据
// export function gerTableData(data) {
//     let result = Base64.encode(JSON.stringify(data))
//     return fetch({
//         url: 'merchantManageUserData.json',
//         method: 'get',
//         data: result
//     })
// } 

// 查询会员等级信息
export function I_SCRM_INTERFACE_601(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_601.action',
        method: 'POST',
        data: result
    })
} 

// 保存商户管理员 - 会员卡信息
export function I_SCRM_INTERFACE_602(data) {
    let result = Base64.encode(JSON.stringify(data))
    // console.log(result, 'result');
    return fetch({
        url: '/I_SCRM_INTERFACE_602.action',
        method: 'post',
        data: result
    })
}

// 查询会员卡信息
export function I_SCRM_INTERFACE_101(data) {
    let result = Base64.encode(JSON.stringify(data));
    // console.log(result, 'result');
    return fetch({
        url: '/I_SCRM_INTERFACE_101.action',
        method: 'post',
        data: result
    })
}

// 保存会员卡信息
export function I_SCRM_INTERFACE_102(data) {
    let result = Base64.encode(JSON.stringify(data));
//  console.log(result, 'result');
    return fetch({
        url: '/I_SCRM_INTERFACE_102.action',
        method: 'post',
        data: result
    })
}



