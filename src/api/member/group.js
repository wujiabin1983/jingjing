import fetch from '@/utils/fetch'

/**
 *
 * @param {
    "userId" : "当前登录用户账号",
	"page":"当前页",
	"limit":"每页记录数",
	"groupName":"分组名称"(可空)
}分页查询会员分组-所有分组
 */
export function selectGroupAll(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_843.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-所有分组-分组详情-用户列表
export function searchListGroupAll(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_849.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-所有分组-分组详情-系统分析
export function searchAnalyzeGroupAll(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_848.action',
        method: 'post',
        data: result
    })
}




// 分页查询会员分组-预置分组
export function selectGroupInit (data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_310.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-预置分组-分组详情-用户列表
export function searchListGroupInit(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_851.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-预置分组-分组详情-系统分析
export function searchAnalyzeGroupInit(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_850.action',
        method: 'post',
        data: result
    })
}





// 分页查询会员分组-品牌分组
export function selectGroupBrand(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_844.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-品牌分组-分组详情-用户列表
export function searchListGroupBrand(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_853.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-品牌分组-分组详情-系统分析
export function searchAnalyzeGroupBrand(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_852.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-品牌分组-添加
export function addGroupBrand(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_146.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-品牌分组-移除
export function removeGroupBrand(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_145.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-品牌分组-修改
export function editGroupBrand(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_614.action',
        method: 'post',
        data: result
    })
}




// 分页查询会员分组-共享分组
export function selectGroupShare(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_845.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-我的分组-分组详情-用户列表
export function searchListGroupShare(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_855.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-我的分组-分组详情-系统分析
export function searchAnalyzeGroupShare(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_854.action',
        method: 'post',
        data: result
    })
}





// 分页查询会员分组-我的分组
export function selectGroupMine(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_846.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-我的分组-分组详情-用户列表
export function searchListGroupMine(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_857.action',
        method: 'post',
        data: result
    })
}

// 分页查询会员分组-我的分组-分组详情-系统分析
export function searchAnalyzeGroupMine(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_856.action',
        method: 'post',
        data: result
    })
}

// 我的分组-新建
export function addGroupMine(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_385.action',
        method: 'post',
        data: result
    })
}

// 我的分组-移除
export function removeGroupMine(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_394.action',
        method: 'post',
        data: result
    })
}

// 我的分组-共享
export function shareGroupMine(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_397.action',
        method: 'post',
        data: result
    })
}

// 我的分组-编辑
export function editGroupMine(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_144.action',
        method: 'post',
        data: result
    })
}

// 分组动态查询条件
//查询会员分组-扩展字段及维度设置
export function GroupCondition(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_847.action',
        method: 'post',
        data: result
    })
}


//查询会员分组-扩展字段及维度设置
export function selectMemberGroup(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_153.action',
        method: 'post',
        data: result
    })
}
