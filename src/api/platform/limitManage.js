// 平台管理 - 平台系统管理 - 权限分配
import fetch from '@/utils/fetch'

/**
 * 显示左侧的多选组列表
 * @param {
	"userId" : "当前登录用户账号"
    } 
 */
export function selectCommonManage(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_132.action',
        method: 'post',
        data: result
    })
}

/**
 * 查询菜单信息
 * @param {
	"userId" : "当前登录用户账号",
	"groupId" : "用户组ID"
    } 
 */
export function showLimit(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_130.action',
        method: 'post',
        data: result
    })
}

/**
 * 权限分配
 * @param {
	"userId" : "当前登录用户账号",
	"userGroupId" : "用户组ID",
	"menuCode" : []
    }
 */
export function limitSubmit(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: 'I_SCRM_INTERFACE_131.action',
        method: 'post',
        data: result
    })
}