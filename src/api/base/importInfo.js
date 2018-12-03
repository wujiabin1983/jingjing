import fetch from '@/utils/fetch'

/**
 * 数据导入 所有的导入数据查询 方法
 */
// 显示店铺导入数据
export function shopImportInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_503.action',
        method: 'post',
        data: result
    })
}
// 下载店铺信息导入模板
export function shopImportDownload(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_501.action',
        method: 'post',
        data: result
    })
}
// 店铺信息文件导入
export function shopImportFile(data) {
//  let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_502.action',
        method: 'post',
        data: data
    })
}
//------------------------------------
// 显示店组导入数据
export function storeGroupImportInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_137.action',
        method: 'post',
        data: result
    })
}
// 导入店组信息
export function storeGroupImportFile(data) {
//  let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_134.action',
        method: 'post',
        data: data
    })
}
// 下载店组信息导入模板
export function storeGroupImportDownload(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_138.action',
        method: 'post',
        data: result
    })
}
//------------------------------------
// 显示区域导入数据
export function regionalImportInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_430.action',
        method: 'post',
        data: result
    })
}
// 下载区域信息导入模板
export function regionalImportDownload(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_431.action',
        method: 'post',
        data: result
    })
}
// 导入区域信息
export function regionalImportFile(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_432.action',
        method: 'post',
        data: data
    })
}
//------------------------------------
// 显示员工导入数据
export function staffImportInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_405.action',
        method: 'post',
        data: result
    })
}
// 下载员工信息导入模板
export function staffImportDownload(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_406.action',
        method: 'post',
        data: result
    })
}
// 导入员工信息
export function staffImportFile(data) {
//  let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_407.action',
        method: 'post',
        data: data
    })
}
//------------------------------------
// 显示会员信息导入数据
export function memberImportInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_325.action',
        method: 'post',
        data: result
    })
}
// 下载会员信息导入模板
export function memberImportDownload(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_323.action',
        method: 'post',
        data: result
    })
}
// 导入会员信息
export function memberImportFile(data) {
//  let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_324.action',
        method: 'post',
        data: data
    })
}
//------------------------------------
// 显示会员积分导入数据
export function memberLabelImportInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_618.action',
        method: 'post',
        data: result
    })
}

// 下载会员积分导入模板
export function memberLabelImportDownload(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_619.action',
        method: 'post',
        data: result
    })
}
// 导入会员积分导入
export function memberLabelImport(data) {
    // let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_617.action',
        method: 'post',
        data: data
    })
}

//------------------------------------
// 显示订单信息导入数据
export function orderImportInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_133.action',
        method: 'post',
        data: result
    })
}

// 下载订单信息导入模板
export function orderImportDownload(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_129.action',
        method: 'post',
        data: result
    })
}
// 导入订单信息
export function orderImportFile(data) {
//  let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_117.action',
        method: 'post',
        data: data
    })
}


//------------------------------------
// 显示销售汇总导入数据
export function salesImportInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_307.action',
        method: 'post',
        data: result
    })
}

// 下载销售汇总导入模板
export function salesImportDownload(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_305.action',
        method: 'post',
        data: result
    })
}
// 导入销售汇总
export function salesImportFile(data) {
//  let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_306.action',
        method: 'post',
        data: data
    })
}



// 下载销售汇总导入模板
export function selectImportInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_501.action',
        method: 'post',
        data: result
    })
}