// 平台管理 - 模板管理 - 会员分组模板
import fetch from '@/utils/fetch'

/**
 * 分页查询会员分组模板信息
 */

export function selectMemberGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_809.action',
        method: 'post',
        data: result
    })
}
export function selectMemberGroupInfoJurisdiction(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_392.action',
        method: 'post',
        data: result
    })
}

/**
 * 新增会员分组模板信息
 *  {
        "userId" : "当前登录用户账号",
        "memGroupTemp" : {
            "memDimension":"会员维度（json字符创）",
            "fixedDimensions":"固定维度（多选，json字符创）",
            "fixedDimension":"固定维度（单选，json字符创）",
            "groupName":"分组名称"
        }
    }
 */

export function addMemberGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_810.action',
        method: 'post',
        data: result
    })
}
/**
 * 修改会员分组模板信息
 *  {
      "userId" : "当前登录用户账号",
"memGroupTemp" : {
     “id”:”记录id”,
           "memDimension":"会员维度（json字符创）",
           "fixedDimensions":"固定维度（多选，json字符创）",
           "fixedDimension":"固定维度（单选，json字符创）",
     "groupName":"分组名称",
     “version”:”版本”
}
}
 */

export function editMemberGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_811.action',
        method: 'post',
        data: result
    })
}
/**
 * 删除会员分组模板信息
 *  {
      "userId" : "当前登录用户账号",
"id" : "会员分组记录id"，
"groupName":"分组名称"
}
 */

export function deleteMemberGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_812.action',
        method: 'post',
        data: result
    })
}
/**
 * 根据id查询会员分组详细信息
 *  {
      "userId" : "当前登录用户账号",
"id" : "会员分组记录id"
}
 */

export function showMemberGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_813.action',
        method: 'post',
        data: result
    })
}
