import fetch from '@/utils/fetch'

/**
 * 短信模板
 * {
   "userId" : "当前登录用户账号",
	"page" : "开始记录数",
	"limit" : "每页记录数",
"searchContent": "查询条件"//可为空
}
 */
// 显示表格数据
export function selectTemplateData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_605.action',
        method: 'post',
        data: result
    })
}
//新增短信模板信息
export function addTemplateData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_606.action',
        method: 'post',
        data: result
    })
}
//修改短信模板信息
export function setTemplateData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_607.action',
        method: 'post',
        data: result
    })
}
//删除短信模板信息
export function deleteTemplateData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_608.action',
        method: 'post',
        data: result
    })
}
//查询短信模板的标签
export function selectTemplateLabel(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_642.action',
        method: 'post',
        data: result
    })
}
export function selectInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_642.action',
        method: 'post',
        data: result
    })
}

