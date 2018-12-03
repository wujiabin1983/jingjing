import fetch from '@/utils/fetch'

/**
 * 门店管理 - 区域管理
 * {
        "userId" : "当前登录用户账号",
        "page" : "开始记录数",//可为空
        "limit" : "每页记录数",//可为空
        "searchContent": "查询条件"//可为空
    }
    {
        returnCode: "0/-1",
        totalCount: "总记录数",
        returnMsg: [{
            "id": "记录id",
            "areaId": "区域编码",
            "areaName": "区域名称",
            "storeGroupCount": "店组数量",
            "storesCount": "门店数量",
            "version": "版本号"
        },...]
    }
 */
// 显示表格数据
export function regionalManagement(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_038.action',
        method: 'post',
        data: result
    })
}
// 添加区域
export function addRegionalManagement(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_039.action',
        method: 'post',
        data: result
    })
}
// 修改区域
export function setRegionalManagement(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_040.action',
        method: 'post',
        data: result
    })
}
// 删除区域
export function delectRegionalManagement(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_041.action',
        method: 'post',
        data: result
    })
}
export function delectStoreGroupManagementInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'regionalManagement.json',
        method: 'get',
        data: result
    })
}
// 区域导入详情
export function importRegionalInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_433.action',
        method: 'post',
        data: result
    })
}

// 区域查询门店详情
export function importStoreManagement(data) {
    let result = Base64.encode(JSON.stringify(data))
//  console.log(data)
    return fetch({
        url: '/I_SCRM_INTERFACE_450.action',
        method: 'post',
        data: result
    })
}