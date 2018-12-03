import fetch from '@/utils/fetch'

// 查询用户列表信息
/**{
	"userName" : "当前用户登录名"
	"queryCode" : "查询条件",//可为空
	"page" : "开始记录数",//可为空
	"limit" : "每页记录数",//可为空
}
{
	"returnCode": "0/-1",
    "returnMsg": {[
		"id" : "记录ID(修改用)",
		"realName" : "真实姓名",
		"userName" : "用户登录名",
		"departmentId" : "部门ID",
		"departmentName" : "部门名称",
		"userGroupId" : "用户组ID",
		"userGroupName" : "用户组名称",
		"userRoleId" : "角色ID",
		"userRoleName" : "角色名称",
		"mobile" : "手机号",
		"status" : "状态",
		"age" : "年龄",
		"sex" : "性别",
		"email" : "邮箱",
		"tel" : "固定电话",
		"documentCode" : "证件号",
		"addr" : "详细地址",
		"remarks" : "备注",
		"version" : "版本记录(修改用)"
	],...}
} */
export function selectUserInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
		url: '/I_SCRM_INTERFACE_018.action',
        method: 'post',
        data: result
    })
}

// 新增用户信息
/**{
	"userCode" : "当前用户登录名",
	"realName" : "真实姓名",
	"userName" : "用户登录名",
	"departmentId" : "部门ID",
	"departmentName" : "部门名称",
	"userGroupId" : "用户组ID",
	"userGroupName" : "用户组名称",
	"userRoleId" : "角色ID",
	"userRoleName" : "角色名称",
	"mobile" : "手机号",//可为空
	"status" : "状态",
	"age" : "年龄",//可为空
	"sex" : "性别",//可为空
	"email" : "邮箱",//可为空
	"tel" : "固定电话",//可为空
	"documentCode" : "证件号",//可为空
	"addr" : "详细地址",//可为空
	"remarks" : "备注"//可为空
}
{
    "returnCode": "0/-1",
    "returnMsg": 成功/失败"
} */
export function addUserInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
		url: '/I_SCRM_INTERFACE_019.action',
        method: 'post',
        data: result
    })
}   

// 修改用户信息
/**{
	"userCode" : "当前用户登录名",
	"id" : "记录ID",
	"realName" : "真实姓名",
	"userName" : "用户登录名",
	"departmentId" : "部门ID",
	"departmentName" : "部门名称",
	"userGroupId" : "用户组ID",
	"userGroupName" : "用户组名称",
	"userRoleId" : "角色ID",
	"userRoleName" : "角色名称",
	"mobile" : "手机号",//可为空
	"status" : "状态",
	"age" : "年龄",//可为空
	"sex" : "性别",//可为空
	"email" : "邮箱",//可为空
	"tel" : "固定电话",//可为空
	"documentCode" : "证件号",//可为空
	"addr" : "详细地址",//可为空
	"remarks" : "备注",//可为空
	"version" : "版本记录"
}
{
    "returnCode": "0/-1",
    "returnMsg": 成功/失败"
} */
export function updateUserInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
		url: '/I_SCRM_INTERFACE_020.action',
        method: 'post',
        data: result
    })
}  

// 删除用户信息  批量删除还未完成
/**{
	"userName" : "当前用户登录名"
	"idArray" : "记录ID1,ID2,..."
}
{
    "returnCode": "0/-1",
    "returnMsg": 成功/失败"
} */
export function deleteUserInfo(data) {
	let result = Base64.encode(JSON.stringify(data));
    return fetch({
		url: '/I_SCRM_INTERFACE_021.action',
        method: 'post',
        data: result
    })
}  

/**	停用 */
export function stopUserInfo(data) {
	let result = Base64.encode(JSON.stringify(data));
	return fetch({
		url: '/I_SCRM_INTERFACE_339.action',
		method: 'post',
		data: result
	})
}  

/**	启用 */
export function startUserInfo(data) {
	let result = Base64.encode(JSON.stringify(data));
	return fetch({
		url: '/I_SCRM_INTERFACE_338.action',
		method: 'post',
		data: result
	})
}  

































