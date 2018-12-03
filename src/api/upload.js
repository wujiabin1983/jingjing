import fetch from '@/utils/fetch'
// 上传图片
/**{
    "userId" : "当前登录用户账号",
	"id" : "记录id"
} */
export function returnSelectedFile(data) {
    let result = Base64.encode(JSON.stringify(data))
    // let result = data
    return fetch({
        url: '/I_SCRM_INTERFACE_032.action',
        method: 'post',
        data: result
    })
}