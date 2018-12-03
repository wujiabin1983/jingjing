import fetch from '@/utils/fetch'


//群发消息-已入会会员
export function selectSendMember(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_683.action',
        method: 'post',
        data: result
    })
}


//群发消息-未入会粉丝
export function selectSendNoMember(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_684.action',
        method: 'post',
        data: result
    })
}

//模板消息下拉框
export function selectMessageWechatInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_686.action',
        method: 'post',
        data: result
    })
}
//模板消息下拉框-消息内容
export function selectMessageWechatInfoContent(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_687.action',
        method: 'post',
        data: result
    })
}

//请求门店
export function selectStoreData(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_334.action',
        method: 'post',
        data: result
    })
}

// 请求会员分组398
export function selectMemberGroup(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_398.action',
        method: 'post',
        data: result
    })
}
//请求员工的选择门店   有门店  店组  区域
export function selectTabData(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_327.action',
        method: 'post',
        data: result
    })
}
//请求标签下拉框
export function selectLabelData(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_347.action',
        method: 'post',
        data: result
    })
}

//商户用户组查用户信息
export function selectGroupUser(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_112.action',
        method: 'post',
        data: result
    })
}
//平台用户组查用户信息
export function selectPlatGroupUser(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_018ByUserGroupId.action',
        method: 'post',
        data: result
    })
}

//请求店组的选择门店
export function selectGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_142.action',
        method: 'post',
        data: result
    })
}

//区域查门店
export function selectAreaStoreInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_393.action',
        method: 'post',
        data: result
    })
}
//请求店组的选择门店
export function selectAreaInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_368.action',
        method: 'post',
        data: result
    })
}


//请求当前登录用户的品牌信息
export function getBrandInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_343.action',
        method: 'post',
        data: result
    })
}

//请求角色信息
export function selectRoleData(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_648.action',
        method: 'post',
        data: result
    })
}
//请求会员等级信息
export function selectLevalInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_603.action',
        method: 'post',
        data: result
    })
}

//请求审核人
export function selectAudioUser(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_714.action',
        method: 'post',
        data: result
    })
}

/**** 请求下拉框 ***********************************************************/
//请求省市区
export function selectProCityArea(data) {
    let result = Base64.encode(JSON.stringify(data));
//  console.log(data)
    return fetch({
        url: '/I_SCRM_INTERFACE_333.action',
        method: 'post',
        data: result
    })
}
// 请求下拉 - 用户组名称 - 商户
export function selectUserGroupName(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_140.action',
        method: 'post',
        data: result
    })
}
// 请求下拉 - 员工 所属角色
export function selectRoleInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_648.action',
        method: 'post',
        data: result
    })
}
// 请求下拉 -常量-{"getConstantCode":""}
export function selectContentInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_425.action',
        method: 'post',
        data: result
    })
}
// 请求下拉 - 用户组名称 - 平台
export function selectUserplatGroupName(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_132.action',
        method: 'post',
        data: result
    })
}
// 请求下拉树 - 角色名称
export function selectUserName(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_141.action',
        method: 'post',
        data: result
    })
}
// 请求下拉树 - 平台角色名称
export function selectPlatUserName(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_661.action',
        method: 'post',
        data: result
    })
}
// 请求下拉树 - 日志类型
export function selectLogType(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_498.action',
        method: 'post',
        data: result
    })
}
// 请求下拉树 - 日志类型
export function selectDepartmentName(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_132.action',
        method: 'post',
        data: result
    })
}

// 请求下拉树 - 可查看部门
export function selectDepartment(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_006.action',
        method: 'post',
        data: result
    })
}

// 常量 - 自定义链接
export function getCustomLinksConstCustomize (data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_381.action',
        method: 'post',
        data: result
    })
}
// 常量 - 自定义链接
export function getCustomLinksConst (data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_381_01.action',
        method: 'post',
        data: result
    })
}

// 门店 - 类目
export function getCategory(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_383.action',
        method: 'post',
        data: result
    })
}

// 门店 券库 - 查优惠券信息
export function getCoupInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_764.action',
        method: 'post',
        data: result
    })
}
// 券包 - 查优惠券信息
export function getCoupPackageInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_150.action',
        method: 'post',
        data: result
    })
}