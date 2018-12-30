import fetch from '@/utils/fetch'

/**
 * 工作管理  - 会员回访
 */
// 显示表格数据
export function getMemberReturnVisitList(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1001.action',
    method: 'post',
    data: result
  })
}

// 新增回访任务
export function addMemberReturnTask(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1003.action',
    method: 'post',
    data: result
  })
}

// 回访任务详情
export function getMemberReturnTaskDetails(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1002.action',
    method: 'post',
    data: result
  })
}

// 删除回访任务
export function deleteMemberReturnTask(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
      url: '/I_SCRM_INTERFACE_1005.action',
      method: 'post',
      data: result
    })
  }
// 停止回访任务
export function stopMemberReturnTask(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
      url: '/I_SCRM_INTERFACE_1006.action',
      method: 'post',
      data: result
    })
  }
// 启用回访任务
export function startMemberReturnTask(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
      url: '/I_SCRM_INTERFACE_1007.action',
      method: 'post',
      data: result
    })
  }