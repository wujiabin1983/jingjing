import fetch from '@/utils/fetch'

// 5 组织架构菜单树  √
/**{
	"id": "节点ID"//可为空
} */
export function lazyTree(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_005.action',
        method: 'post',
        data: result
    })
}

// 6 添加组织架构信息 添加提示成功，√
/**{
	"parentId": "上级组织架构代码",
	"parentName": "上级组织架构名称",
	"departmentId": "当前组织架构代码",
	"departmentName": "当前组织架构名称",
	"departmentDesc": "组织架构描述"//可为空
} */
export function addContOrgInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_007.action',
        method: 'post',
        data: result
    })
}

// 7 删除组织架构信息    √
/**{
	"id" : "记录ID",
	"parentIdFull" : "父级完全节点ID",
	"departmentIdFull" : "部门完全节点ID",
	"departmentNameFull" : "部门完全节点名称"
} */
export function deleteContOrgInfo(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_008.action',
        method: 'post',
        data: result
    })
}

// 8 根据部门获取用户信息(组织架构页面右下角用户列表)  √
/**{
	"page" : "开始记录数",//可为空
	"limit" : "每页记录数",//可为空
	"departmentId" : "部门ID"
} */
export function showUserInfoByDepartmentId(data) {
    let result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_009.action',
        method: 'post',
        data: result
    })
}

