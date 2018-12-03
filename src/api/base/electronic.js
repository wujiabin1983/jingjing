import fetch from '@/utils/fetch'

/**
 * 品牌管理
 * {
   "userId" : "当前登录用户账号",
	"page" : "开始记录数",
	"limit" : "每页记录数",
"searchContent": "查询条件"//可为空
}
 */
export function addElectronic(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_205.action',
        method: 'post',
        data: result
    })
}
export function selectElectronic(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_206.action',
        method: 'post',
        data: result
    })
}

export function setElectronic(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_207.action',
        method: 'post',
        data: result
    })
}
