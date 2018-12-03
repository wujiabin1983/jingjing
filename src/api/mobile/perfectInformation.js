import fetch from '@/utils/fetch'


// 编辑表格显示
export function perfectInfoTableShow(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_349.action',
        method: 'post',
        data: result
    })
}

// 显示预留字段
export function extendFieldDataShow(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_350.action',
        method: 'post',
        data: result
    })
}

// 删除预留字段
export function extendFieldDataDelete(data) {
    const result = Base64.encode(JSON.stringify(data))
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_391.action',
        method: 'post',
        data: result
    })
}

// 保存排序
export function perfectInfoTableSort(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'mobile/perfectInfoTableSort.json',
        method: 'get',
        data: result
    })
}

// 设置会员奖励规则
export function setRuleSet(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_825.action',
        method: 'post',
        data: result
    })
}

// 查询会员奖励规则
export function selectRuleSet(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_829.action',
        method: 'post',
        data: result
    })
}

// 完善资料-发布
export function perfectInfoSave(data) {
    const result = Base64.encode(JSON.stringify(data))
//  console.log(result)
    return fetch({
        url: '/I_SCRM_INTERFACE_348.action',
        method: 'post',
        data: result
    })
}