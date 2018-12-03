import fetch from '@/utils/fetch'

// 13 查询角色列表信息
/**{
	"userName" : "当前用户登录名"
	"userRoleName" : "查询条件",//可为空
	"page" : "开始记录数",//可为空
	"limit" : "每页记录数",//可为空
} 
{
	"returnCode": "0/-1",
    "returnMsg": {[
		"id" : "记录ID(修改用)",
		"userRoleId" : "角色代码",
		"userRoleName" : "角色代码",
		"departmentListDesc" : "可查看部门",
		"sellerNameList" : "可查看商户",
		"userRoleDesc" : "描述",
		"version" : "版本记录(修改用)"
	],...}
}*/
export function selectUserRoleInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
		url: '/I_SCRM_INTERFACE_014.action',
        method: 'post',
        data: result
    })
}

// 新增角色信息
/**{
	"userName" : "当前用户登录名"
} 
{
	"returnCode": "0/-1",
    "returnMsg": {
		"userRoleId" : "角色代码",
		"userRoleName" : "角色代码",
		"departmentListId" : "可查看部门ID1,ID2,....",
		"departmentListDesc" : "可查看部门Name1,Name2,....",
		"sellerIdList" : "可查看商户ID1,ID2,....",
		"sellerNameList" : "可查看商户Name1,Name2,....",
		"userRoleDesc" : "描述"//可为空
	}
}*/
export function addUserRoleInfo(data) {
	let result = Base64.encode(JSON.stringify(data));
	// console.log(result);
    return fetch({
		url: '/I_SCRM_INTERFACE_015.action',
        method: 'post',
        data: result
    })
}

// 修改角色信息
/**{
	"userName" : "当前用户登录名"
	"id" : "记录ID",
	"userRoleName" : "角色代码",
	"departmentListId" : "可查看部门ID1,ID2,....",
	"departmentListDesc":"可查看部门Name1,Name2,....",
	"sellerIdList" : "可查看商户ID1,ID2....",
	"sellerNameList" : "可查看商户Name1,Name2,....",
	"userRoleDesc" : "描述"//可为空,
	"version" : "版本记录"
}
{
    "returnCode": "0/-1",
    "returnMsg": 成功/失败"
} */
export function updateUserRoleInfo(data) {
	let result = Base64.encode(JSON.stringify(data));
//	console.log(result);
    return fetch({
		url: '/I_SCRM_INTERFACE_016.action',
        method: 'post',
        data: result
    })
}

// 删除角色信息
/**{
	"userName" : "当前用户登录名"
	"idArray" : "记录ID1,ID2,..."
}
{
    "returnCode": "0/-1",
    "returnMsg": 成功/失败"
} */
export function deleteUserRoleInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
		url: '/I_SCRM_INTERFACE_017.action',
        method: 'post',
        data: result
    })
}



























2