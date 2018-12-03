import fetch from '@/utils/fetch'

/**
 * 门店管理- 门店管理
 */
// 显示表格数据
export function selectStoreManagement(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_057.action',
        method: 'post',
        data: result
    })
}
//新增门店
export function addStoreManagement(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_058.action',
        method: 'post',
        data: result
    })
}
//修改门店
export function setStoreManagement(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_059.action',
        method: 'post',
        data: result
    })
}
//获取门店
export function getStoreManagement(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_149.action',
        method: 'post',
        data: result
    })
}
//删除门店
export function deleteStoreManagement(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: 'storeManagement.json',
        method: 'post',
        data: result
    })
}
//上架/下架
export function putawayStatus(data) {
//	console.log(data)
    let result = Base64.encode(JSON.stringify(data));
//  console.log(result)
    return fetch({
        url: '/I_SCRM_INTERFACE_336.action',
        method: 'post',
        data: result
    })
}
//导出
export function exportData(data) {
//	console.log(JSON.stringify(data))
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_061.action',
        method: 'post',
        data: result
    })
}
//同步到微信
export function synchroStoresInfo(data) {
//	console.log(JSON.stringify(data))
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_377.action',
        method: 'post',
        data: result
    })
}
//同步到微信
export function syncWechat(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: 'storeManagement.json',
        method: 'post',
        data: result
    })
}
// 显示导入页面的表格数据
export function importStoreManagement(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_504.action',
        method: 'post',
        data: result
    })
}

// 显示上传图片
export function uploadImg(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_378.action',
        method: 'post',
        data: result
    })
}
