import fetch from '@/utils/fetch'

/**
 * 会员信息 
 */

// 显示表格数据
export function importMemberInfo(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_326.action',
        method: 'post',
        data: result
    })
}


