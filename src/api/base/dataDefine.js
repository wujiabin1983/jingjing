import fetch from '@/utils/fetch'

// 数据定义 - 生命周期 - 查询
export function dataDefineShow(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_509.action',
        method: 'post',
        data: result
    })
}


// 数据定义 - 生命周期 - 新增   
export function dataDefineAdd(data) {
    let result = Base64.encode(JSON.stringify(data))
    // console.log(result)
    return fetch({
        url: '/I_SCRM_INTERFACE_510.action',
        method: 'post',
        data: result
    })
}

// 数据定义 - 生命周期 - 修改
export function dataDefineEdit(data) {
    let result = Base64.encode(JSON.stringify(data))
    // console.log(result)
    return fetch({
        url: '/I_SCRM_INTERFACE_511.action',
        method: 'post',
        data: result
    })
}

// 数据定义 - 维度设置 - 查询
export function dimensionSettingShow(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_411.action',
        method: 'post',
        data: result
    })
}

// 数据定义 - 维度设置 - 新增
export function dimensionSettingAdd(data) {
    let result = Base64.encode(JSON.stringify(data))
//  console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_412.action',
        method: 'post',
        data: result
    })
}
// 数据定义 - 维度设置 - 新增
export function dimensionSettingSet(data) {
    let result = Base64.encode(JSON.stringify(data))
//  console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_413.action',
        method: 'post',
        data: result
    })
}

// 扩展字段 - 表格显示
export function ExtendFieldInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
//  console.log(result)
    return fetch({
        url: '/I_SCRM_INTERFACE_301.action',
        method: 'post',
        data: result
    })
}
// 扩展字段 - 新增字段
export function ExtendFieldAdd(data) {
    let result = Base64.encode(JSON.stringify(data))
//  console.log(result)
    return fetch({
        url: '/I_SCRM_INTERFACE_302.action',
        method: 'post',
        data: result
    })
}
// 扩展字段 - 修改
export function ExtendFieldEdit(data) {
    let result = Base64.encode(JSON.stringify(data))
//  console.log(result)
    return fetch({
        url: '/I_SCRM_INTERFACE_380.action',
        method: 'post',
        data: result
    })
}
// 数据定义 - 扩展字段 - 新增
export function dimensionAdd(data) {
    let result = Base64.encode(JSON.stringify(data))
//  console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_380.action',
        method: 'post',
        data: result
    })
}
// 数据定义 - 扩展字段 - 查询
export function dimensionSelect(data) {
    let result = Base64.encode(JSON.stringify(data))
//  console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_379.action',
        method: 'post',
        data: result
    })
}