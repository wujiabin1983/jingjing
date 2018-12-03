import fetch from '@/utils/fetch'
//会员信息  会员查询  会员详情

//会员优惠券 会员信息
export function selectMember870(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_870.action',
        method: 'post',
        data: result
    })
}

//会员优惠券 积分记录
export function selectMember662(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_662.action',
        method: 'post',
        data: result
    })
}

//会员优惠券 沟通记录信息
export function selectMember151(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_151.action',
        method: 'post',
        data: result
    })
}
//会员优惠券 沟通记录列表
export function selectMember152(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_152.action',
        method: 'post',
        data: result
    })
}


//会员查询-消费记录统计
export function selectMember863(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_863.action',
        method: 'post',
        data: result
    })
}

//会员查询-消费记录列表
export function selectMember864(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_864.action',
        method: 'post',
        data: result
    })
}

//会员查询-购买商品统计
export function selectMember865(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_865.action',
        method: 'post',
        data: result
    })
}

//会员查询-购买商品列表
export function selectMember866(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_866.action',
        method: 'post',
        data: result
    })
}

//会员查询-活动记录列表
export function selectMember867(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_867.action',
        method: 'post',
        data: result
    })
}

//会员优惠券用券记录
export function selectMember769(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_769.action',
        method: 'post',
        data: result
    })
}

//会员优惠券用券记录列表
export function selectMember770(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_770.action',
        method: 'post',
        data: result
    })
}

//会员查询-邀请记录
export function selectMember664(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_664.action',
        method: 'post',
        data: result
    })
}

//会员查询-标签记录
export function selectMember395(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_395.action',
        method: 'post',
        data: result
    })
}
//会员查询-服务记录
export function selectMember663(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_663.action',
        method: 'post',
        data: result
    })
}

//会员查询-资料修改记录
export function selectMember869(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_869.action',
        method: 'post',
        data: result
    })
}


