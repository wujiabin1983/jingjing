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
// 显示表格数据
export function selectBrandInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_048.action',
        method: 'post',
        data: result
    })
}
//添加品牌
/**
 * 
 * @param {
	"userId": "当前登录用户账号",
	"brandId": "品牌编码",
	"brandName": "品牌名称"
	"brandLogo": "品牌Logo",
	"brandDesc": "品牌描述",
	"officialAccounts": "绑定公众号",
	"appId": "APPID",
	"appSecret": "AP_SECRET",
	"pattern": "模式"
} data
 */
export function addBrandInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_049.action',
        method: 'post',
        data: result
    })
}
//修改品牌
/**{
	"userId": "当前登录用户账号",
	"id": "id",
	"brandId": "品牌编码",
	"brandName": "品牌名称",
	"brandLogo": "品牌Logo",
	"brandDesc": "品牌描述",
	"officialAccounts": "绑定公众号",
	"appId": "APPID",
	"appSecret": "AP_SECRET",
	"pattern": "模式",
	"version": "版本号"
} */
export function setBrandInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_050.action',
        method: 'post',
        data: result
    })
}
//删除品牌
/**{
    "userId" : "当前登录用户账号",
	"params" : "id1,id2,id3,...."
} */
export function deleteBrandInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_051.action',
        method: 'post',
        data: result
    })
}
//上传logo
/**{
    "userId" : "当前登录用户账号",
	"path" : "logo实际路径"
} */
export function uploadImg(data) {
    // let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_052.action',
        method: 'post',
        data: data
    })
}
export function uploadImgQuill(data) {
    // let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_052_02.action',
        method: 'post',
        data: data
    })
}

export function uploadAudio(data) {
    // let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_052_01.action',
        method: 'post',
        data: data
    })
}

export function uploadImg2(data) {
    // let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_052.action',
        method: 'post',
        data: data
    })
}
//根据id查看品牌详情
/**{
    "userId" : "当前登录用户账号",
	"id" : "记录id"
} */
export function showBrandInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_319.action',
        method: 'post',
        data: result
    })
}

// 绑定公众号二维码
export function showQrcode(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/receive/getComponentLoginPageUrl.action',
        method: 'post',
        data: result
    })
}
