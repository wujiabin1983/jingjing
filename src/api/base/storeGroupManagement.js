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

// 添加店组
export function addStoreGroupManagementInfo(data) {
//	console.log(JSON.stringify(data)+"添加入参");
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_064.action',
        method: 'post',
        data: result
    })
}

// 修改店组
export function setStoreGroupManagementInfo(data) {
//	console.log(JSON.stringify(data)+"修改入参");
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_065.action',
        method: 'post',
        data: result
    })
}

// 删除店组
export function delectStoreGroupManagementInfo(data) {
//	console.log(JSON.stringify(data)+"删除入参");
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_066.action',
        method: 'post',
        data: result
    })
}

// 导出
export function exportData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_067.action',
        method: 'post',
        data: result
    })
}
// 显示导入页面的表格数据
export function importStoreGroup(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_139.action',
        method: 'post',
        data: result
    })
}
