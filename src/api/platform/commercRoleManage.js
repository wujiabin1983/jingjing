import fetch from '@/utils/fetch'

// 24查询商户角色信息  // 传参 返回内容没有加密 eyJzdGFydCI6IiIsImxpbWl0IjoiIiwic2VhcmNoQ29udGVudCI6IiJ9
/**{
    start: "第几页"
    limit: "每页记录数"
	searchContent: "查询条件"
} */
export function selectSellerRoleInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_033.action',
        method: 'post',
        data: result
    })
}

// 25 添加商户角色信息
/**{
"userCode": "当前登陆用户的用户代码",
"userType": "当前登陆用户的用户类型",
	"userRoleId": "角色代码",
	"userRoleName": "角色名称",
	"departmentListCode": "可查看部门ID",
	"departmentListDesc": "可查看部门名称",
	"userRoleDesc": "角色描述"
} */
export function addSellerRoleInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_034.action',
        method: 'post',
        data: result
    })
}

// 26 修改商户角色信息
/**{
"userCode": "当前登陆用户的用户代码",
"userType": "当前登陆用户的用户类型",
	"userRoleId": "角色代码",
	"userRoleName": "角色名称",
	"departmentListCode": "可查看部门ID",
	"departmentListDesc": "可查看部门名称",
"userRoleDesc": "角色描述",
"id": "记录id",
"version": "版本号"
} */
export function updateSellerRoleInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_035.action',
        method: 'post',
        data: result
    })
}

// 27 删除商户角色信息
/**{
"userCode": "当前登陆用户的用户代码",
"userType": "当前登陆用户的用户类型",
	"params" : "id1,id2,id3,...."
} */
export function deleteSellerRoleInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_036.action',
        method: 'post',
        data: result
    })
}