import fetch from '@/utils/fetch'

// 9 用户组列表    系统错误， 请求数据 eyJ1c2VyTmFtZSI6ImFkbWluMDEiLCJwYWdlIjoiIiwibGltaXQiOiIiLCJ1c2VHcm91cE5hbWUiOiIifQ
/**{
	"userName" : "用户登录名",
	"page" : "开始记录数",//可为空
	"limit" : "每页记录数",//可为空
	"useGroupName" : "用户组名称"//可为空
} */
export function selectUserGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_010.action',
        method: 'post',
        data: result
    })
}

// 10 新增用户组  接口文档请求数值重复 userGroupId  返回系统错误   传值： eyJ1c2VyR3JvdXBJZCI6IjM0MzQiLCJ1c2VyR3JvdXBOYW1lIjoiZXdyZXJlciIsInVzZXJHcm91cERlc2MiOiJlcmVyZXIifQ
/**{
	"userGroupId" : "用户组代码",
	"userGroupId" : "用户组代码",
	"useGroupName" : "用户组名称",
	"useGroupDesc" : "用户组描述"//可为空
} */
export function addUserGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_011.action',
        method: 'post',
        data: result
    })
}

// 11 修改用户组信息 没有数据无法测试
/**{
	"id" : "记录ID",
	"useGroupDesc" : "用户组描述"//可为空
	"version" : "版本记录"
} */
export function updateUserGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_012.action',
        method: 'post',
        data: result
    })
}

// 12 删除用户组信息 没有数据无法测试
/**{
	"idArray" : "id1,id2,id3,...."
} */
export function deleteUserGroupInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_013.action',
        method: 'post',
        data: result
    })
}
