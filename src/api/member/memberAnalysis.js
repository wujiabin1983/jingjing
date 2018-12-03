import fetch from '@/utils/fetch'
//地图数据
export function selectChinaMemberData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_900.action',
        method: 'post',
        data: result
    })
}

//各省数量排名
export function selectChinaMemberDataList(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_901.action',
        method: 'post',
        data: result
    })
}

//会员分析数据
export function selectMemberAnalysisData(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_688.action',
        method: 'post',
        data: result
    })
}

//会员分析数据
export function selectMemberAnalysisData1(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
        url: '/I_SCRM_INTERFACE_689.action',
        method: 'post',
        data: result
    })
}