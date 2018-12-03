import fetch from '@/utils/fetch'

/**
 * 门店管理- 店组管理
 */
// 显示表格数据
export function selectStoreGroupManagementInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_063.action',
        method: 'post',
        data: result
    })
}
// 店组导入-查看门店信息
export function selectStoreData(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_142.action',
        method: 'post',
        data: result
    })
}