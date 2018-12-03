import fetch from '@/utils/fetch'

/**
 * 新建活动-选择用户导入
 */
// 显示会员信息导入数据
export function memberImportInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_624.action',
        method: 'post',
        data: result
    })
}
// 下载会员信息导入模板
export function memberImportDownload(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_625.action',
        method: 'post',
        data: result
    })
}
// 导入会员信息
export function memberImportFile(data) {
//  let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_623.action',
        method: 'post',
        data: data
    })
}