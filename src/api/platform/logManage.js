import fetch from '@/utils/fetch'

/**
 * 商户用户管理
 */
// 显示表格数据
export function selectLogManageInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
//  console.log(result);
    return fetch({
        url: 'I_SCRM_INTERFACE_046.action',
        method: 'POST',
        data: result
    })
}


export function exportLogManageInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
//  console.log(result);
    return fetch({
        url: 'I_SCRM_INTERFACE_047.action',
        method: 'POST',
        data: result
    })
}
