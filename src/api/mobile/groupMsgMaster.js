import fetch from '@/utils/fetch'


// 分页查询
export function groupMsgMasterShow(data) {
    const result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_820_01.action',
        method: 'post',
        data: result
    })
}


// 保存添加
export function groupMsgMasterAdd(data) {
    const result = Base64.encode(JSON.stringify(data));
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_821.action',
        method: 'post',
        data: result
    })
}

// 修改
export function groupMsgMasterEdit(data) {
    const result = Base64.encode(JSON.stringify(data));
    // console.log(result);
    return fetch({
        url: '/I_SCRM_INTERFACE_822.action',
        method: 'post',
        data: result
    })
}

// 删除
export function groupMsgMasterDelete(data) {
    const result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_823.action',
        method: 'post',
        data: result
    })
}

// 人数
export function groupMsgMasterNum(data) {
    const result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_824.action',
        method: 'post',
        data: result
    })
}

// 根据id查询
export function selectInfo(data) {
    const result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_868.action',
        method: 'post',
        data: result
    })
}
// 根据id查询群发消息详细信息
export function I_SCRM_INTERFACE_842(data) {
    const result = Base64.encode(JSON.stringify(data));
    return fetch({
        url: '/I_SCRM_INTERFACE_842.action',
        method: 'post',
        data: result
    })
}
